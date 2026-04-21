import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Onboarding Pages
import RoleSelection from "./pages/signup/RoleSelection";
import OTPVerification from "./pages/signup/OTPVerification";
import EmailOTPVerification from "./pages/signup/EmailOTPVerification";
import ProfileSetup from "./pages/signup/ProfileSetup";
import KYCVerification from "./pages/signup/KYCVerification";
import OnboardingComplete from "./pages/signup/Complete";
import NotFound from "./pages/NotFound";

// Worker Pages
import WorkerHome from "./pages/worker/Home";
import WorkerSearch from "./pages/worker/Search";
import WorkerMessages from "./pages/worker/Messages";
import WorkerProfile from "./pages/worker/Profile";
import WorkerQueueStatus from "./pages/worker/QueueStatus";
import WorkerCheckIn from "./pages/worker/CheckIn";
import WorkerTicket from "./pages/worker/Ticket";
import WorkerNotifications from "./pages/worker/Notifications";
import WorkerMyGigs from "./pages/worker/MyGigs";
import WorkerAttendance from "./pages/worker/Attendance";
import ClassifiedAds from "./pages/worker/ClassifiedAds";
import LongTermJobs from "./pages/worker/LongTermJobs";
import WorkerWallet from "./pages/worker/Wallet";

// Employer Pages
import EmployerHome from "./pages/employer/Home";
import EmployerPostings from "./pages/employer/Postings";
import EmployerMessages from "./pages/employer/Messages";
import EmployerInvoices from "./pages/employer/Invoices";
import EmployerNotifications from "./pages/employer/Notifications";
import EmployerAttendance from "./pages/employer/Attendance";
import ApplicantDetail from "./pages/employer/ApplicantDetail";
import PostJob from "./pages/employer/PostJob";
import Employees from "./pages/employer/Employees";
import EmployeeDetail from "./pages/employer/EmployeeDetail";
import EmployerOnboarding from "./pages/employer/onboarding/EmployerOnboarding";
import JobManage from "./pages/employer/JobManage";
import EmployerProfile from "./pages/employer/Profile";

// ─── HZLR.store — Customer ───────────────────────
import StoreHome from "./pages/store/StoreHome";
import MerchantStorefront from "./pages/store/MerchantStorefront";
import Cart from "./pages/store/Cart";
import OrderTracking from "./pages/store/OrderTracking";
import CustomerOrders from "./pages/store/CustomerOrders";

// ─── HZLR.store — Merchant Portal ────────────────
import MerchantOnboarding from "./pages/merchant/MerchantOnboarding";
import ApprovalPending from "./pages/merchant/ApprovalPending";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import CatalogManager from "./pages/merchant/CatalogManager";
import MerchantOrders from "./pages/merchant/MerchantOrders";
import MerchantSettlements from "./pages/merchant/MerchantSettlements";
import MerchantSettings from "./pages/merchant/MerchantSettings";

// ─── HZLR.store — Delivery Partner ───────────────
import DeliveryOptIn from "./pages/worker/DeliveryOptIn";
import DeliveryLive from "./pages/worker/DeliveryLive";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Onboarding Routes */}
            <Route path="/signup/otp" element={<OTPVerification />} />
            <Route path="/signup/verify-email" element={<EmailOTPVerification />} />
            <Route path="/signup/role" element={<RoleSelection />} />
            <Route path="/signup/profile" element={<ProfileSetup />} />
            <Route path="/signup/kyc" element={<KYCVerification />} />
            <Route path="/signup/complete" element={<OnboardingComplete />} />

            {/* Worker Routes */}
            <Route path="/worker" element={<Navigate to="/worker/home" replace />} />
            <Route path="/worker/home" element={<WorkerHome />} />
            <Route path="/worker/search" element={<WorkerSearch />} />
            <Route path="/worker/gigs" element={<WorkerSearch />} />
            <Route path="/worker/messages" element={<WorkerMessages />} />
            <Route path="/worker/profile" element={<WorkerProfile />} />
            <Route path="/worker/queue-status" element={<WorkerQueueStatus />} />
            <Route path="/worker/checkin" element={<WorkerCheckIn />} />
            <Route path="/worker/ticket" element={<WorkerTicket />} />
            <Route path="/worker/notifications" element={<WorkerNotifications />} />
            <Route path="/worker/my-gigs" element={<WorkerMyGigs />} />
            <Route path="/worker/attendance" element={<WorkerAttendance />} />
            <Route path="/worker/classified-ads" element={<ClassifiedAds />} />
            <Route path="/worker/long-term-jobs" element={<LongTermJobs />} />
            <Route path="/worker/wallet" element={<WorkerWallet />} />
            <Route path="/worker/signup" element={<Navigate to="/signup" replace />} />

            {/* Delivery Partner Routes */}
            <Route path="/worker/delivery" element={<DeliveryOptIn />} />
            <Route path="/worker/delivery/live" element={<DeliveryLive />} />

            {/* Employer Routes */}
            <Route path="/employer" element={<Navigate to="/employer/home" replace />} />
            <Route path="/employer/onboarding" element={<EmployerOnboarding />} />
            <Route path="/employer/home" element={<EmployerHome />} />
            <Route path="/employer/post" element={<PostJob />} />
            <Route path="/employer/postings" element={<EmployerPostings />} />
            <Route path="/employer/postings/:id" element={<JobManage />} />
            <Route path="/employer/applicants" element={<EmployerPostings />} />
            <Route path="/employer/applicants/:id" element={<ApplicantDetail />} />
            <Route path="/employer/messages" element={<EmployerMessages />} />
            <Route path="/employer/invoices" element={<EmployerInvoices />} />
            <Route path="/employer/notifications" element={<EmployerNotifications />} />
            <Route path="/employer/attendance" element={<EmployerAttendance />} />
            <Route path="/employer/employees" element={<Employees />} />
            <Route path="/employer/employees/:workerId" element={<EmployeeDetail />} />
            <Route path="/employer/profile" element={<EmployerProfile />} />
            <Route path="/employer/signup" element={<Navigate to="/signup" replace />} />

            {/* ─── HZLR.store — Customer ──────────────────── */}
            <Route path="/store" element={<StoreHome />} />
            <Route path="/store/merchant/:id" element={<MerchantStorefront />} />
            <Route path="/store/cart" element={<Cart />} />
            <Route path="/store/orders" element={<CustomerOrders />} />
            <Route path="/store/orders/:id" element={<OrderTracking />} />

            {/* ─── HZLR.store — Merchant Portal ───────────── */}
            <Route path="/merchant" element={<Navigate to="/merchant/dashboard" replace />} />
            <Route path="/merchant/onboard" element={<MerchantOnboarding />} />
            <Route path="/merchant/pending" element={<ApprovalPending />} />
            <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
            <Route path="/merchant/catalog" element={<CatalogManager />} />
            <Route path="/merchant/orders" element={<MerchantOrders />} />
            <Route path="/merchant/settlements" element={<MerchantSettlements />} />
            <Route path="/merchant/settings" element={<MerchantSettings />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

