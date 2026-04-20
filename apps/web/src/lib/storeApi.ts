// Centralized store API client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };
}

async function req<T>(method: string, path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_URL}/api/v1/store${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data as T;
}

export const storeApi = {
  // Categories
  getCategories: () => req<any[]>('GET', '/categories'),

  // Merchants
  onboard: (data: any) => req<any>('POST', '/merchants/onboard', data),
  getMerchantMe: () => req<any>('GET', '/merchants/me'),
  updateMerchantMe: (data: any) => req<any>('PATCH', '/merchants/me', data),
  getNearby: (lat: number, lng: number, radius = 10) =>
    req<any[]>('GET', `/merchants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  getMerchant: (id: string) => req<any>('GET', `/merchants/${id}`),

  // Products
  getProducts: (merchantId: string, params: Record<string, string> = {}) => {
    const q = new URLSearchParams({ merchantId, ...params }).toString();
    return req<any[]>('GET', `/products?${q}`);
  },
  addProduct: (data: any) => req<any>('POST', '/products', data),
  updateProduct: (id: string, data: any) => req<any>('PATCH', `/products/${id}`, data),
  deleteProduct: (id: string) => req<any>('DELETE', `/products/${id}`),

  // Cart
  getCart: () => req<any>('GET', '/cart'),
  addToCart: (productId: string, quantity: number) => req<any>('POST', '/cart/items', { productId, quantity }),
  updateCartItem: (itemId: string, quantity: number) => req<any>('PATCH', `/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId: string) => req<any>('DELETE', `/cart/items/${itemId}`),
  clearCart: () => req<any>('DELETE', '/cart'),

  // Orders
  placeOrder: (data: any) => req<any>('POST', '/orders', data),
  getMyOrders: () => req<any[]>('GET', '/orders/my'),
  getMerchantOrders: () => req<any[]>('GET', '/orders/merchant'),
  getOrder: (id: string) => req<any>('GET', `/orders/${id}`),
  updateOrderStatus: (id: string, status: string) => req<any>('PATCH', `/orders/${id}/status`, { status }),
  cancelOrder: (id: string, reason?: string) => req<any>('POST', `/orders/${id}/cancel`, { cancelReason: reason }),

  // Delivery
  deliveryOptIn: (vehicleType: string) => req<any>('POST', '/delivery/opt-in', { vehicleType }),
  setAvailability: (isOnline: boolean, lat?: number, lng?: number) =>
    req<any>('PATCH', '/delivery/availability', { isOnline, currentLat: lat, currentLng: lng }),
  getAssignments: () => req<any[]>('GET', '/delivery/assignments'),
  acceptAssignment: (id: string) => req<any>('PATCH', `/delivery/assignments/${id}/accept`),
  declineAssignment: (id: string) => req<any>('PATCH', `/delivery/assignments/${id}/decline`),
  pickedUp: (id: string) => req<any>('PATCH', `/delivery/assignments/${id}/picked-up`),
  delivered: (id: string) => req<any>('PATCH', `/delivery/assignments/${id}/delivered`),

  // Settlements
  getMerchantSettlements: () => req<any>('GET', '/settlements/merchant'),
  getSettlement: (id: string) => req<any>('GET', `/settlements/${id}`),

  // Subscriptions
  getSubStatus: () => req<any>('GET', '/subscriptions/status'),

  // Admin
  getPendingMerchants: () => req<any[]>('GET', '/admin/merchants/pending'),
  approveMerchant: (id: string) => req<any>('PATCH', `/admin/merchants/${id}/approve`),
  suspendMerchant: (id: string, reason?: string) => req<any>('PATCH', `/admin/merchants/${id}/suspend`, { reason }),
  getDeliveryFeeConfig: () => req<any>('GET', '/admin/delivery-fee-config'),
  updateDeliveryFeeConfig: (data: any) => req<any>('PATCH', '/admin/delivery-fee-config', data),
};
