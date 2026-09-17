import { StatusType } from "@/components/portal/StatusBadge";

export interface ModelProfile {
  id: string;
  firstName: string;
  lastName: string;
  pointsBalance: number;
  formattedPoints: string;
  email?: string;
  phone?: string;
  handle?: string;
  bio?: string;
  height?: string;
  measurements?: string;
  shoeSize?: string;
  eyeColor?: string;
  hairColor?: string;
  rating?: number;
  completedBookingsCount?: number;
  categories?: string[];
  location?: string;
  instagram?: string;
  agency?: string;
}

export interface GigItem {
  id: string;
  title: string;
  description: string;
  hourlyRateLKR: number;
  status: "pending" | "live";
  durationHours: string;
  venueName: string;
  highlightTitle: string;
  highlightSubtitle: string;
  whatsIncluded: string[];
  galleryImages: string[];
}

export interface BookingItem {
  id: string;
  clientName: string;
  dateTime: string;
  duration: string;
  location: string;
  status: StatusType; // pending | accepted | rejected | completed
  paymentLKR: number;
  notes?: string;
}

export const MOCK_MODEL_PROFILE: ModelProfile = {
  id: "model_shalini",
  firstName: "Shalini",
  lastName: "Perera",
  pointsBalance: 75500,
  formattedPoints: "75,500.00",
  email: "shalini.perera@islandmonkey.io",
  phone: "+94 77 234 5678",
  handle: "@shalini_perera",
  bio: "Commercial & editorial fashion talent with 5+ years experience spanning high-fashion runways, lookbook shoots, and international apparel campaigns.",
  height: "5' 9\" (175 cm)",
  measurements: "33 - 24 - 35",
  shoeSize: "39 EU / 8.5 US",
  eyeColor: "Dark Brown",
  hairColor: "Natural Black",
  rating: 4.9,
  completedBookingsCount: 28,
  categories: ["Editorial", "Commercial", "Runway", "Swimwear"],
  location: "Colombo, Sri Lanka",
  instagram: "@shalini.modele",
  agency: "Island Monkey Talent Agency",
};

export const MOCK_GIGS: GigItem[] = [
  {
    id: "gig_basic",
    title: "Basic Fashion Shoot",
    description: "Studio apparel lookbook shoot with 2 outfit changes and professional lighting setup.",
    hourlyRateLKR: 4500,
    status: "pending",
    durationHours: "3 Hours",
    venueName: "Studio B",
    highlightTitle: "Studio Wardrobe & Hair Styling Provided",
    highlightSubtitle: "2 outfit changes with professional color correction",
    whatsIncluded: [
      "Full Wardrobe & Prop Access",
      "Lead Stylist Assistance",
      "High-Speed Wi-Fi & Refreshments",
      "Digital Portfolio Rights",
    ],
    galleryImages: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg", "/placeholder4.jpg"],
  },
  {
    id: "gig_premium",
    title: "Premium Fashion Shoot",
    description: "Ideal for high fashion editorial shoots, brand catalog covers, and commercial campaigns.",
    hourlyRateLKR: 7000,
    status: "live",
    durationHours: "4 Hours",
    venueName: "Main Stage A",
    highlightTitle: "Cover Editorial & Cinematic Lighting",
    highlightSubtitle: "Full creative team support and high-res master delivery",
    whatsIncluded: [
      "Master Wardrobe Access",
      "Senior Hair & Makeup Artist",
      "Express Preview Delivery",
      "Commercial Rights License",
    ],
    galleryImages: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg", "/placeholder4.jpg"],
  },
  {
    id: "gig_editorial",
    title: "Editorial Fashion Shoot",
    description: "A complete high-end production experience for magazine features and commercial video reels.",
    hourlyRateLKR: 10000,
    status: "live",
    durationHours: "6 Hours",
    venueName: "Outdoor Location",
    highlightTitle: "Full Video & Still Production Rig",
    highlightSubtitle: "RAW footage access & physical composite cards",
    whatsIncluded: [
      "Full On-Set VIP Team",
      "Catering & Private Dressing Trailer",
      "Same-Day RAW Previews",
      "Global Commercial Usage License",
    ],
    galleryImages: ["/placeholder1.jpg", "/placeholder2.jpg", "/placeholder3.jpg", "/placeholder4.jpg"],
  },
];

export const MOCK_BOOKINGS: BookingItem[] = [
  {
    id: "bk_001",
    clientName: "Carnage",
    dateTime: "Oct 24, 2026 • 10:00 AM",
    duration: "4 Hours",
    location: "Studio A",
    status: "pending",
    paymentLKR: 28000,
    notes: "Activewear lookbook shoot. Bring nude undergarments.",
  },
  {
    id: "bk_002",
    clientName: "Pepper St.",
    dateTime: "Nov 02, 2026 • 02:00 PM",
    duration: "3 Hours",
    location: "Retail Flagship",
    status: "accepted",
    paymentLKR: 21000,
    notes: "In-store pop-up promo campaign stills.",
  },
  {
    id: "bk_003",
    clientName: "FOA Studios",
    dateTime: "Nov 15, 2026 • 11:00 AM",
    duration: "2 Hours",
    location: "Studio B",
    status: "rejected",
    paymentLKR: 14000,
    notes: "Schedule conflict with international campaign.",
  },
  {
    id: "bk_004",
    clientName: "Apex Runway",
    dateTime: "Dec 01, 2026 • 06:00 PM",
    duration: "6 Hours",
    location: "Grand Hall",
    status: "accepted",
    paymentLKR: 42000,
    notes: "Annual fashion show lead runway walking model.",
  },
  {
    id: "bk_005",
    clientName: "Velvet Lookbook",
    dateTime: "Aug 12, 2026 • 01:00 PM",
    duration: "4 Hours",
    location: "Stage 2",
    status: "completed",
    paymentLKR: 28000,
    notes: "Completed autumn winter catalog shoot.",
  },
  {
    id: "bk_006",
    clientName: "Urban Streetwear",
    dateTime: "Jul 28, 2026 • 09:00 AM",
    duration: "5 Hours",
    location: "Outdoor Lot",
    status: "completed",
    paymentLKR: 35000,
    notes: "Outdoor video commercial reels completed.",
  },
  {
    id: "bk_007",
    clientName: "Aura Beauty",
    dateTime: "Jul 14, 2026 • 11:30 AM",
    duration: "3 Hours",
    location: "Studio B",
    status: "completed",
    paymentLKR: 21000,
    notes: "Skincare product close-up portrait shoot.",
  },
  {
    id: "bk_008",
    clientName: "Monochrome Glam",
    dateTime: "Jun 30, 2026 • 03:00 PM",
    duration: "4 Hours",
    location: "Main Stage",
    status: "completed",
    paymentLKR: 28000,
    notes: "Black and white portrait series completed.",
  },
];
