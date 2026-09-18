export interface CustomerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  memberId?: string;
  role?: string;
  qrCodeValue: string;
}

export interface BalanceInfo {
  pointsBalance: number;
  conversionRateLKR: number; // 1 Point = 200 LKR
  formattedPoints: string;
  lastUpdated: string;
}

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  priceLKR: number; // Single source of truth for package price
  isBestSeller?: boolean;
  durationHours: string; // e.g. "4 Hours"
  studioName: string; // e.g. "Studio A"
  photographersCount: number; // e.g. 2
  metaLine: string; // Dynamic meta line: "4 Hours • Studio A • 2 Photographers"
  highlightFeature: {
    title: string;
    subtitle: string;
  };
  whatsIncluded: string[];
  imageUrl?: string;
}

export interface SessionItem {
  id: string;
  title: string;
  timestamp: string;
  studioTag: string; // e.g. "Studio A"
  status: "upcoming" | "completed" | "cancelled";
  imageUrl?: string;
}

export const MOCK_CUSTOMER_USER: CustomerUser = {
  id: "cust_101",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  qrCodeValue: "ISLANDMONKEY-CUST-101-987654321",
};

export const MOCK_CUSTOMER_BALANCE: BalanceInfo = {
  pointsBalance: 124500.0,
  conversionRateLKR: 200,
  formattedPoints: "124,500.00",
  lastUpdated: "Today",
};

export const MOCK_PACKAGES: PackageItem[] = [
  {
    id: "starter-package",
    name: "Starter Package",
    description:
      "Perfect for personal shoots, portraits, and small events with professional photo or video coverage.",
    priceLKR: 14000,
    isBestSeller: false,
    durationHours: "2 Hours",
    studioName: "Studio B",
    photographersCount: 1,
    metaLine: "2 Hours • Studio B • 1 Photographer",
    highlightFeature: {
      title: "Essential Studio Lighting & 25 shots",
      subtitle: "Color corrected & high-res delivery",
    },
    whatsIncluded: [
      "Access to Standard Studio Props",
      "High-Speed Wi-Fi & Refreshments",
      "Same-Day Image Previews",
      "Digital Delivery Link",
    ],
  },
  {
    id: "growth-package",
    name: "Growth Package",
    description:
      "Ideal for businesses, couples, and medium-sized events needing high-quality photography and videography.",
    priceLKR: 24000,
    isBestSeller: true,
    durationHours: "4 Hours",
    studioName: "Studio A",
    photographersCount: 2,
    metaLine: "4 Hours • Studio A • 2 Photographers",
    highlightFeature: {
      title: "Pro Lighting & 50% shots",
      subtitle: "Fully edited and high-res delivery",
    },
    whatsIncluded: [
      "Full Access to Wardrobe & Props",
      "Professional Hair & Makeup",
      "High-Speed Wi-Fi & Refreshments",
      "Same-Day Image Previews",
    ],
  },
  {
    id: "premium-package",
    name: "Premium Package",
    description:
      "A complete production experience with extended coverage, advanced editing, and premium creative deliverables.",
    priceLKR: 32000,
    isBestSeller: false,
    durationHours: "8 Hours",
    studioName: "Main Stage",
    photographersCount: 3,
    metaLine: "8 Hours • Main Stage • 3 Crew Members",
    highlightFeature: {
      title: "Full Cinematic Rig & Unlimited shots",
      subtitle: "Master grade color editing & RAW files",
    },
    whatsIncluded: [
      "Full Access to All Wardrobes & Master Props",
      "Lead Stylist + Hair & Makeup Team",
      "VIP Lounge & Catering Service",
      "Same-Day Express RAW Delivery",
      "Physical Print Album Included",
    ],
  },
];

export const MOCK_UPCOMING_SESSIONS: SessionItem[] = [
  {
    id: "sess_01",
    title: "Studio Session",
    timestamp: "10:42 AM • Oct 24, 2026",
    studioTag: "Studio A",
    status: "upcoming",
  },
  {
    id: "sess_02",
    title: "Portrait Shoot",
    timestamp: "02:00 PM • Nov 02, 2026",
    studioTag: "Studio B",
    status: "upcoming",
  },
  {
    id: "sess_03",
    title: "Commercial Video Shoot",
    timestamp: "11:30 AM • Nov 15, 2026",
    studioTag: "Main Stage",
    status: "upcoming",
  },
];
