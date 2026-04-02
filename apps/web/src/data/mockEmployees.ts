export interface Employee {
  id: string;
  name: string;
  phone: string;
  hzlrId: string;
  photoUrl: string;
  reliabilityScore: number;
  totalGigs: number;
  lastWorkedDate: string;
  lastActiveDate: string;
  groomingVerified: boolean;
  identityVerified: boolean;
  preferredCategory: string;
  categories: string[];
  avgRating: number;
  onTimePercentage: number;
  cancellationCount: number;
  totalEarned: number;
}

export interface WorkHistory {
  id: string;
  workerId: string;
  gigTitle: string;
  role: string;
  category: string;
  date: string;
  pay: number;
  status: "Completed" | "Cancelled" | "No-show";
  rating?: number;
  punctuality?: string;
}

export const mockEmployees: Employee[] = [
  {
    id: "emp-001",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    hzlrId: "HZLR-WK-4821",
    photoUrl: "",
    reliabilityScore: 94,
    totalGigs: 127,
    lastWorkedDate: "2024-12-10",
    lastActiveDate: "2024-12-13",
    groomingVerified: true,
    identityVerified: true,
    preferredCategory: "F&B",
    categories: ["F&B", "Events", "Hospitality"],
    avgRating: 4.8,
    onTimePercentage: 96,
    cancellationCount: 3,
    totalEarned: 189500,
  },
  {
    id: "emp-002",
    name: "Priya Sharma",
    phone: "+91 87654 32109",
    hzlrId: "HZLR-WK-3912",
    photoUrl: "",
    reliabilityScore: 88,
    totalGigs: 84,
    lastWorkedDate: "2024-12-08",
    lastActiveDate: "2024-12-12",
    groomingVerified: true,
    identityVerified: true,
    preferredCategory: "Events",
    categories: ["Events", "Retail"],
    avgRating: 4.6,
    onTimePercentage: 91,
    cancellationCount: 5,
    totalEarned: 124800,
  },
  {
    id: "emp-003",
    name: "Mohammed Iqbal",
    phone: "+91 76543 21098",
    hzlrId: "HZLR-WK-5634",
    photoUrl: "",
    reliabilityScore: 72,
    totalGigs: 45,
    lastWorkedDate: "2024-11-28",
    lastActiveDate: "2024-12-01",
    groomingVerified: false,
    identityVerified: true,
    preferredCategory: "Logistics",
    categories: ["Logistics", "Warehouse"],
    avgRating: 4.2,
    onTimePercentage: 82,
    cancellationCount: 8,
    totalEarned: 67500,
  },
  {
    id: "emp-004",
    name: "Anita Devi",
    phone: "+91 65432 10987",
    hzlrId: "HZLR-WK-2847",
    photoUrl: "",
    reliabilityScore: 96,
    totalGigs: 203,
    lastWorkedDate: "2024-12-12",
    lastActiveDate: "2024-12-13",
    groomingVerified: true,
    identityVerified: true,
    preferredCategory: "Hospitality",
    categories: ["Hospitality", "F&B", "Events"],
    avgRating: 4.9,
    onTimePercentage: 98,
    cancellationCount: 2,
    totalEarned: 312400,
  },
  {
    id: "emp-005",
    name: "Suresh Patel",
    phone: "+91 54321 09876",
    hzlrId: "HZLR-WK-7291",
    photoUrl: "",
    reliabilityScore: 45,
    totalGigs: 18,
    lastWorkedDate: "2024-10-15",
    lastActiveDate: "2024-10-20",
    groomingVerified: false,
    identityVerified: false,
    preferredCategory: "Warehouse",
    categories: ["Warehouse"],
    avgRating: 3.5,
    onTimePercentage: 65,
    cancellationCount: 6,
    totalEarned: 22500,
  },
  {
    id: "emp-006",
    name: "Lakshmi Nair",
    phone: "+91 43210 98765",
    hzlrId: "HZLR-WK-8156",
    photoUrl: "",
    reliabilityScore: 91,
    totalGigs: 156,
    lastWorkedDate: "2024-12-11",
    lastActiveDate: "2024-12-13",
    groomingVerified: true,
    identityVerified: true,
    preferredCategory: "Retail",
    categories: ["Retail", "Events"],
    avgRating: 4.7,
    onTimePercentage: 94,
    cancellationCount: 4,
    totalEarned: 234600,
  },
  {
    id: "emp-007",
    name: "Vikram Singh",
    phone: "+91 32109 87654",
    hzlrId: "HZLR-WK-4523",
    photoUrl: "",
    reliabilityScore: 78,
    totalGigs: 67,
    lastWorkedDate: "2024-12-05",
    lastActiveDate: "2024-12-10",
    groomingVerified: true,
    identityVerified: true,
    preferredCategory: "Security",
    categories: ["Security", "Events"],
    avgRating: 4.4,
    onTimePercentage: 88,
    cancellationCount: 6,
    totalEarned: 98700,
  },
  {
    id: "emp-008",
    name: "Fatima Begum",
    phone: "+91 21098 76543",
    hzlrId: "HZLR-WK-6789",
    photoUrl: "",
    reliabilityScore: 85,
    totalGigs: 92,
    lastWorkedDate: "2024-12-09",
    lastActiveDate: "2024-12-11",
    groomingVerified: true,
    identityVerified: true,
    preferredCategory: "F&B",
    categories: ["F&B", "Hospitality"],
    avgRating: 4.5,
    onTimePercentage: 90,
    cancellationCount: 5,
    totalEarned: 137800,
  },
];

export const mockWorkHistory: WorkHistory[] = [
  {
    id: "wh-001",
    workerId: "emp-001",
    gigTitle: "Diwali Corporate Event",
    role: "Server",
    category: "Events",
    date: "2024-12-10",
    pay: 1800,
    status: "Completed",
    rating: 5,
    punctuality: "On-time",
  },
  {
    id: "wh-002",
    workerId: "emp-001",
    gigTitle: "Restaurant Weekend Shift",
    role: "Waiter",
    category: "F&B",
    date: "2024-12-07",
    pay: 1200,
    status: "Completed",
    rating: 4,
    punctuality: "On-time",
  },
  {
    id: "wh-003",
    workerId: "emp-001",
    gigTitle: "Wedding Reception",
    role: "Hospitality Staff",
    category: "Events",
    date: "2024-12-01",
    pay: 2500,
    status: "Completed",
    rating: 5,
    punctuality: "Early",
  },
  {
    id: "wh-004",
    workerId: "emp-001",
    gigTitle: "Hotel Breakfast Service",
    role: "Server",
    category: "Hospitality",
    date: "2024-11-28",
    pay: 1000,
    status: "Cancelled",
    punctuality: undefined,
  },
  {
    id: "wh-005",
    workerId: "emp-004",
    gigTitle: "Conference Setup",
    role: "Event Staff",
    category: "Events",
    date: "2024-12-12",
    pay: 1600,
    status: "Completed",
    rating: 5,
    punctuality: "On-time",
  },
  {
    id: "wh-006",
    workerId: "emp-004",
    gigTitle: "Hotel Night Shift",
    role: "Front Desk",
    category: "Hospitality",
    date: "2024-12-10",
    pay: 1400,
    status: "Completed",
    rating: 5,
    punctuality: "On-time",
  },
];
