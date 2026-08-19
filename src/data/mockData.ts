import { Car, Fuel, Gauge, Calendar, ShieldCheck, Banknote, History, Zap, Settings, Star } from 'lucide-react';

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  transmission: 'Manual' | 'Automatic';
  engine: string;
  color: string;
  ownership: string; // 1st Owner, 2nd Owner
  registration: string;
  images: string[];
  features: string[];
  status: 'Available' | 'Sold' | 'Booked' | 'Deleted';
  description?: string;
  instagramReel?: string;
  updatedAt?: number;
  deleted?: boolean;
};

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "porsche_911_gt3_rs",
    make: "Porsche",
    model: "911 GT3 RS",
    variant: "4.0 Weissach Package",
    year: 2023,
    price: 38500000,
    mileage: 4200,
    fuelType: "Petrol",
    transmission: "Automatic",
    engine: "4.0L Naturally Aspirated Flat-6 (518 HP)",
    color: "Lizard Green / Carbon Accent",
    ownership: "1st Owner",
    registration: "MH-01-EE-9000",
    images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800"],
    features: ["Weissach Package", "Carbon Ceramic Brakes (PCCB)", "Rear Axle Steering", "Front Axle Lift System", "Magnesium Racing Wheels", "Club Sport Package"],
    status: "Available",
    description: "A road-legal track masterpiece. This Lizard Green 911 GT3 RS features the highly sought-after Weissach Package, reducing weight and enhancing aerodynamics. Immaculately maintained by a single enthusiast collector with complete Porsche Mumbai center records.",
    updatedAt: Date.now(),
    deleted: false
  },
  {
    id: "mercedes_g63_amg",
    make: "Mercedes-Benz",
    model: "G63 AMG",
    variant: "V8 Bi-Turbo Edition 55",
    year: 2022,
    price: 26500000,
    mileage: 12000,
    fuelType: "Petrol",
    transmission: "Automatic",
    engine: "4.0L Twin-Turbo V8 (577 HP)",
    color: "Matte Obsidian Black",
    ownership: "1st Owner",
    registration: "MH-02-FN-1111",
    images: ["https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=800"],
    features: ["AMG Night Package", "22-inch Forged AMG Wheels", "Burmester Surround Sound System", "Bespoke Nappa Leather Concept", "Dynamic Ride Control Active Suspension", "Red Brake Calipers"],
    status: "Available",
    description: "The ultimate power statement. Obsidian Black metallic exterior combined with red/black bi-color Nappa leather. Complete company service records, absolute showroom condition.",
    updatedAt: Date.now(),
    deleted: false
  },
  {
    id: "range_rover_autobio",
    make: "Land Rover",
    model: "Range Rover",
    variant: "3.0 LWB Autobiography (D350)",
    year: 2021,
    price: 19500000,
    mileage: 24000,
    fuelType: "Diesel",
    transmission: "Automatic",
    engine: "3.0L twin-turbocharged inline-6 Diesel (346 HP)",
    color: "Belgravia Green Metallic",
    ownership: "1st Owner",
    registration: "MH-47-AA-0300",
    images: ["https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=800"],
    features: ["Executive Class Rear Seating", "Meridian Signature Sound System (1600W)", "Panoramic Sliding Sunroof", "Laser LED Headlights", "Cabin Air Purification Pro", "24-Way Heated & Cooled Massage Seats"],
    status: "Available",
    description: "Unrivaled luxury and off-road capability. Belgravia Green exterior with semi-aniline Perlino leather interior. Serviced strictly at Land Rover authorized workshops in Mumbai.",
    updatedAt: Date.now(),
    deleted: false
  }
];

export const MOCK_REVIEWS = [
  {
    id: 1,
    name: "Sameer Ahmed",
    rating: 5,
    text: "Picked up a beautiful pre-owned BMW 5 Series from the team for my daily commutes. The car is absolutely pristine—even the local mechanic couldn't find a single fault. No pushy sales pitch, just honest advice and super fast paperwork. Really happy with the deal.",
    date: "2 months ago"
  },
  {
    id: 2,
    name: "Ajinkya Deshmukh",
    rating: 5,
    text: "Was looking for a clean, well-maintained Range Rover Velar for some time. Visited their private parking boutique on a Sunday, inspected the car, and got the delivery sorted in less than 48 hours. Genuine people, clear history, and transparent RTO transfer.",
    date: "1 month ago"
  },
  {
    id: 3,
    name: "Gurpreet Singh Sandhu",
    rating: 5,
    text: "Got an immaculate Mercedes-Benz E-Class as a surprise gift for my wife. The detailing and polish job they did made the car look like it just rolled out of a brand-new showroom. Excellent premium service, highly recommended!",
    date: "3 weeks ago"
  }
];

export const MOCK_LEADS = [
  { id: 'l1', name: 'Sanjay Gupta', phone: '9876543210', email: 'sanjay@example.com', car: 'Hyundai Creta', status: 'New Lead', date: '2026-06-05' },
  { id: 'l2', name: 'Neha Singh', phone: '9988776655', email: 'neha@example.com', car: 'Honda City', status: 'Contacted', date: '2026-06-04' },
  { id: 'l3', name: 'Vikram Joshi', phone: '9123456789', email: 'vikram@example.com', car: 'Kia Seltos', status: 'Negotiating', date: '2026-06-02' }
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};
