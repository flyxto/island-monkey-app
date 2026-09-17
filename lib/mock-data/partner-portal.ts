export interface StoreProfile {
  id: string;
  storeName: string;
  dailyPointsProcessed: number;
  transactionsProcessedCount: number;
  rating?: number;
  totalPointsProcessed?: string;
  category?: string;
  location?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  openingHours?: string;
  businessRegNumber?: string;
  posTerminalId?: string;
  about?: string;
}

export interface PartnerTransaction {
  id: string;
  itemName: string;
  timestamp: string;
  userId: string;
  pointsDeducted: number; // e.g. 450
  amountLKR: number; // e.g. 90000
}

export interface PartnerOffer {
  id: string;
  name: string;
  description: string;
  pointsCost: number; // e.g. 8500
  imageUrl?: string;
}

export interface CustomerLookup {
  id: string;
  name: string;
  phone: string;
  pointsBalance: number;
  formattedBalance: string;
}

export const MOCK_STORE_PROFILE: StoreProfile = {
  id: "store_pepper",
  storeName: "Pepper St.",
  dailyPointsProcessed: 1240,
  transactionsProcessedCount: 28,
  rating: 4.9,
  totalPointsProcessed: "248.5k",
  category: "Apparel & Lifestyle Boutique",
  location: "42 Ward Place, Colombo 07, Sri Lanka",
  phone: "+94 11 268 4500",
  email: "hello@pepperst.lk",
  instagram: "@pepperst.official",
  openingHours: "Mon - Sun: 10:00 AM - 8:00 PM",
  businessRegNumber: "PV-109482",
  posTerminalId: "IM-POS-7741",
  about: "Curated contemporary apparel, ethical linen wear, and island lifestyle accessories. Official Island Monkey retail redemption partner.",
};

export const MOCK_PARTNER_TRANSACTIONS: PartnerTransaction[] = [
  {
    id: "tx_001",
    itemName: "Blue Denim Jacket",
    timestamp: "10:42 AM",
    userId: "#8829",
    pointsDeducted: 450,
    amountLKR: 90000,
  },
  {
    id: "tx_002",
    itemName: "Cotton T-Shirt",
    timestamp: "09:15 AM",
    userId: "#1042",
    pointsDeducted: 180,
    amountLKR: 36000,
  },
  {
    id: "tx_003",
    itemName: "Leather Belt",
    timestamp: "08:40 AM",
    userId: "#3391",
    pointsDeducted: 220,
    amountLKR: 44000,
  },
  {
    id: "tx_004",
    itemName: "Linen Shirt",
    timestamp: "Yesterday",
    userId: "#5512",
    pointsDeducted: 350,
    amountLKR: 70000,
  },
  {
    id: "tx_005",
    itemName: "Studio Pass & Cap",
    timestamp: "Yesterday",
    userId: "#9904",
    pointsDeducted: 600,
    amountLKR: 120000,
  },
];

export const MOCK_PARTNER_OFFERS: PartnerOffer[] = [
  {
    id: "offer_linen",
    name: "Linen Shirts - Awurudu Offer",
    description: "Exclusive 100% pure organic Sri Lankan linen shirts collection discount.",
    pointsCost: 8500,
  },
  {
    id: "offer_denim",
    name: "Blue Denim Jacket - 20% Off",
    description: "Handcrafted vintage denim jackets with custom studio embroidery.",
    pointsCost: 12000,
  },
  {
    id: "offer_wallet",
    name: "Leather Wallet Bundle",
    description: "Genuine full-grain leather bifold wallet with custom monogramming.",
    pointsCost: 5000,
  },
  {
    id: "offer_portrait",
    name: "Studio Portrait Voucher",
    description: "Redeemable for a 1-hour express portrait session at Island Monkey Studio A.",
    pointsCost: 15000,
  },
  {
    id: "offer_strap",
    name: "Vintage Camera Strap",
    description: "Heavy duty woven camera strap with brass hardware accents.",
    pointsCost: 3200,
  },
];

export const MOCK_CUSTOMER_LOOKUPS: Record<string, CustomerLookup> = {
  cust_8829: {
    id: "cust_8829",
    name: "John Doe",
    phone: "65466565436",
    pointsBalance: 124500,
    formattedBalance: "124,500.00",
  },
};
