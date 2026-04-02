// Mock attendance data for the geo-validated attendance system

export interface AttendanceRecord {
  id: string;
  gigId: string;
  gigTitle: string;
  workerId: string;
  workerName: string;
  workerPhoto?: string;
  reliabilityScore: number;
  checkinTime: string | null;
  checkinLat: number | null;
  checkinLng: number | null;
  checkoutTime: string | null;
  checkoutLat: number | null;
  checkoutLng: number | null;
  scheduledStart: string;
  scheduledEnd: string;
  distanceFromGig: number; // in meters
  latenessMinutes: number;
  status: 'not_started' | 'checked_in' | 'checked_out' | 'pending_confirmation' | 'confirmed' | 'absent';
  employerConfirmed: boolean;
  employerNotes?: string;
}

export interface GigLocation {
  lat: number;
  lng: number;
  address: string;
  allowedRadius: number; // in meters
}

export const mockGigLocations: Record<string, GigLocation> = {
  '101': { lat: 19.0596, lng: 72.8295, address: 'Taj Palace, Colaba', allowedRadius: 150 },
  '102': { lat: 19.1136, lng: 72.8697, address: 'Grand Hyatt, Bandra', allowedRadius: 200 },
  '103': { lat: 19.0748, lng: 72.8856, address: 'ITC Grand, Parel', allowedRadius: 150 },
};

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att_1',
    gigId: '103',
    gigTitle: 'Banquet Service',
    workerId: 'w_1',
    workerName: 'Priya Sharma',
    reliabilityScore: 94,
    checkinTime: '2024-12-13T18:45:00',
    checkinLat: 19.0750,
    checkinLng: 72.8858,
    checkoutTime: null,
    checkoutLat: null,
    checkoutLng: null,
    scheduledStart: '2024-12-13T19:00:00',
    scheduledEnd: '2024-12-13T23:00:00',
    distanceFromGig: 45,
    latenessMinutes: -15, // 15 mins early
    status: 'checked_in',
    employerConfirmed: false,
  },
  {
    id: 'att_2',
    gigId: '103',
    gigTitle: 'Banquet Service',
    workerId: 'w_2',
    workerName: 'Rahul Verma',
    reliabilityScore: 87,
    checkinTime: '2024-12-13T19:05:00',
    checkinLat: 19.0746,
    checkinLng: 72.8854,
    checkoutTime: '2024-12-13T23:10:00',
    checkoutLat: 19.0747,
    checkoutLng: 72.8855,
    scheduledStart: '2024-12-13T19:00:00',
    scheduledEnd: '2024-12-13T23:00:00',
    distanceFromGig: 32,
    latenessMinutes: 5,
    status: 'pending_confirmation',
    employerConfirmed: false,
  },
  {
    id: 'att_3',
    gigId: '101',
    gigTitle: 'Kitchen Staff',
    workerId: 'w_3',
    workerName: 'Amit Kumar',
    reliabilityScore: 91,
    checkinTime: '2024-12-12T06:55:00',
    checkinLat: 19.0598,
    checkinLng: 72.8297,
    checkoutTime: '2024-12-12T14:02:00',
    checkoutLat: 19.0596,
    checkoutLng: 72.8296,
    scheduledStart: '2024-12-12T07:00:00',
    scheduledEnd: '2024-12-12T14:00:00',
    distanceFromGig: 28,
    latenessMinutes: -5,
    status: 'confirmed',
    employerConfirmed: true,
  },
  {
    id: 'att_4',
    gigId: '102',
    gigTitle: 'F&B Service',
    workerId: 'w_4',
    workerName: 'Sneha Patel',
    reliabilityScore: 78,
    checkinTime: null,
    checkinLat: null,
    checkinLng: null,
    checkoutTime: null,
    checkoutLat: null,
    checkoutLng: null,
    scheduledStart: '2024-12-14T18:00:00',
    scheduledEnd: '2024-12-14T23:00:00',
    distanceFromGig: 0,
    latenessMinutes: 0,
    status: 'not_started',
    employerConfirmed: false,
  },
  {
    id: 'att_5',
    gigId: '101',
    gigTitle: 'Kitchen Staff',
    workerId: 'w_5',
    workerName: 'Vikram Singh',
    reliabilityScore: 82,
    checkinTime: null,
    checkinLat: null,
    checkinLng: null,
    checkoutTime: null,
    checkoutLat: null,
    checkoutLng: null,
    scheduledStart: '2024-12-12T07:00:00',
    scheduledEnd: '2024-12-12T14:00:00',
    distanceFromGig: 0,
    latenessMinutes: 0,
    status: 'absent',
    employerConfirmed: false,
    employerNotes: 'No-show, did not respond to calls',
  },
];

// Worker's attendance history
export const mockWorkerAttendanceHistory: AttendanceRecord[] = [
  {
    id: 'att_w1',
    gigId: '103',
    gigTitle: 'Banquet Service',
    workerId: 'current_worker',
    workerName: 'You',
    reliabilityScore: 92,
    checkinTime: '2024-12-13T18:45:00',
    checkinLat: 19.0750,
    checkinLng: 72.8858,
    checkoutTime: null,
    checkoutLat: null,
    checkoutLng: null,
    scheduledStart: '2024-12-13T19:00:00',
    scheduledEnd: '2024-12-13T23:00:00',
    distanceFromGig: 45,
    latenessMinutes: -15,
    status: 'checked_in',
    employerConfirmed: false,
  },
  {
    id: 'att_w2',
    gigId: '104',
    gigTitle: 'Event Setup',
    workerId: 'current_worker',
    workerName: 'You',
    reliabilityScore: 92,
    checkinTime: '2024-12-03T08:58:00',
    checkinLat: 19.0750,
    checkinLng: 72.8858,
    checkoutTime: '2024-12-03T17:05:00',
    checkoutLat: 19.0751,
    checkoutLng: 72.8859,
    scheduledStart: '2024-12-03T09:00:00',
    scheduledEnd: '2024-12-03T17:00:00',
    distanceFromGig: 38,
    latenessMinutes: -2,
    status: 'confirmed',
    employerConfirmed: true,
  },
  {
    id: 'att_w3',
    gigId: '105',
    gigTitle: 'F&B Staff',
    workerId: 'current_worker',
    workerName: 'You',
    reliabilityScore: 92,
    checkinTime: '2024-12-01T17:55:00',
    checkinLat: 19.1136,
    checkinLng: 72.8697,
    checkoutTime: '2024-12-01T23:02:00',
    checkoutLat: 19.1137,
    checkoutLng: 72.8698,
    scheduledStart: '2024-12-01T18:00:00',
    scheduledEnd: '2024-12-01T23:00:00',
    distanceFromGig: 22,
    latenessMinutes: -5,
    status: 'confirmed',
    employerConfirmed: true,
  },
];

// Helper function to get status badge color
export function getAttendanceStatusColor(status: AttendanceRecord['status']): string {
  switch (status) {
    case 'not_started':
      return 'bg-muted text-muted-foreground';
    case 'checked_in':
      return 'bg-status-info/20 text-status-info';
    case 'checked_out':
      return 'bg-status-pending/20 text-status-pending';
    case 'pending_confirmation':
      return 'bg-status-warning/20 text-status-warning';
    case 'confirmed':
      return 'bg-status-success/20 text-status-success';
    case 'absent':
      return 'bg-destructive/20 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getAttendanceStatusLabel(status: AttendanceRecord['status']): string {
  switch (status) {
    case 'not_started':
      return 'Not Started';
    case 'checked_in':
      return 'Checked In';
    case 'checked_out':
      return 'Checked Out';
    case 'pending_confirmation':
      return 'Pending Confirmation';
    case 'confirmed':
      return 'Confirmed';
    case 'absent':
      return 'Absent';
    default:
      return 'Unknown';
  }
}
