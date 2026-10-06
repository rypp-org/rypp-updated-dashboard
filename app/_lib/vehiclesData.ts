export type VehicleCategory = "all" | "bike" | "scooter" | "car";
export type FuelType = "Petrol" | "Diesel" | "Electric";
export type TransmissionType = "Manual" | "Automatic";

export type Vehicle = {
  id: string;
  name: string;
  category: "bike" | "scooter" | "car";
  brand: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  image: string;
  featured?: boolean;
};

export type VehicleDetail = Vehicle & {
  badge?: string;
  engineCapacity: string;
  maxPower: string;
  maxTorque: string;
  mileage: string;
  seatingCapacity: string;
  kerbWeight: string;
  fuelTankCapacity: string;
  brakingSystem: string;
  gallery: string[];
  description: string;
  aboutText: string;
  highlights: Array<{
    title: string;
    desc: string;
  }>;
};

export const ALL_VEHICLES: Vehicle[] = [
  {
    id: "re-himalayan",
    name: "Royal Enfield Himalayan",
    category: "bike",
    brand: "Royal Enfield",
    rating: 4.8,
    reviews: 320,
    pricePerDay: 799,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-himalayan.jpg",
    featured: true,
  },
  {
    id: "ktm-duke-250",
    name: "KTM Duke 250",
    category: "bike",
    brand: "KTM",
    rating: 4.7,
    reviews: 210,
    pricePerDay: 999,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-duke.jpg",
    featured: true,
  },
  {
    id: "honda-activa-6g",
    name: "Honda Activa 6G",
    category: "scooter",
    brand: "Honda",
    rating: 4.6,
    reviews: 180,
    pricePerDay: 499,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "/images/photos/v-activa.jpg",
    featured: true,
  },
  {
    id: "tvs-apache-160",
    name: "TVS Apache RTR 160",
    category: "bike",
    brand: "TVS",
    rating: 4.5,
    reviews: 140,
    pricePerDay: 699,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-classic.jpg",
    featured: true,
  },
  {
    id: "yamaha-r15-v4",
    name: "Yamaha R15 V4",
    category: "bike",
    brand: "Yamaha",
    rating: 4.7,
    reviews: 160,
    pricePerDay: 899,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-r15.jpg",
    featured: true,
  },
  {
    id: "maruti-swift",
    name: "Maruti Swift",
    category: "car",
    brand: "Maruti",
    rating: 4.6,
    reviews: 220,
    pricePerDay: 2499,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "/images/photos/v-swift.jpg",
    featured: true,
  },
  {
    id: "hyundai-creta",
    name: "Hyundai Creta",
    category: "car",
    brand: "Hyundai",
    rating: 4.8,
    reviews: 310,
    pricePerDay: 3499,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: "/images/photos/v-creta.jpg",
    featured: true,
  },
  {
    id: "toyota-innova-crysta",
    name: "Toyota Innova Crysta",
    category: "car",
    brand: "Toyota",
    rating: 4.8,
    reviews: 275,
    pricePerDay: 4999,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: "/images/photos/v-xuv.jpg",
    featured: true,
  },
  {
    id: "mahindra-thar",
    name: "Mahindra Thar",
    category: "car",
    brand: "Mahindra",
    rating: 4.7,
    reviews: 190,
    pricePerDay: 4499,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: "/images/photos/v-thar.jpg",
    featured: true,
  },
  {
    id: "re-classic-350",
    name: "Royal Enfield Classic 350",
    category: "bike",
    brand: "Royal Enfield",
    rating: 4.8,
    reviews: 320,
    pricePerDay: 799,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-classic.jpg",
  },
  {
    id: "tvs-jupiter-125",
    name: "TVS Jupiter 125",
    category: "scooter",
    brand: "TVS",
    rating: 4.4,
    reviews: 140,
    pricePerDay: 449,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "/images/photos/v-jupiter.jpg",
  },
  {
    id: "honda-dio-125",
    name: "Honda Dio 125",
    category: "scooter",
    brand: "Honda",
    rating: 4.5,
    reviews: 130,
    pricePerDay: 479,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: "/images/photos/v-activa.jpg",
  },
  {
    id: "ather-450x",
    name: "Ather 450X EV",
    category: "scooter",
    brand: "Ather",
    rating: 4.7,
    reviews: 215,
    pricePerDay: 599,
    fuelType: "Electric",
    transmission: "Automatic",
    image: "/images/photos/v-activa.jpg",
  },
  {
    id: "ola-s1-pro",
    name: "Ola S1 Pro EV",
    category: "scooter",
    brand: "Ola",
    rating: 4.5,
    reviews: 190,
    pricePerDay: 549,
    fuelType: "Electric",
    transmission: "Automatic",
    image: "/images/photos/v-jupiter.jpg",
  },
  {
    id: "tvs-iqube",
    name: "TVS iQube Electric",
    category: "scooter",
    brand: "TVS",
    rating: 4.6,
    reviews: 165,
    pricePerDay: 529,
    fuelType: "Electric",
    transmission: "Automatic",
    image: "/images/photos/v-jupiter.jpg",
  },
  {
    id: "yamaha-mt15",
    name: "Yamaha MT-15 V2",
    category: "bike",
    brand: "Yamaha",
    rating: 4.6,
    reviews: 155,
    pricePerDay: 849,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-r15.jpg",
  },
  {
    id: "ktm-rc-390",
    name: "KTM RC 390",
    category: "bike",
    brand: "KTM",
    rating: 4.8,
    reviews: 110,
    pricePerDay: 1299,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-duke.jpg",
  },
  {
    id: "re-hunter-350",
    name: "Royal Enfield Hunter 350",
    category: "bike",
    brand: "Royal Enfield",
    rating: 4.6,
    reviews: 175,
    pricePerDay: 749,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-himalayan.jpg",
  },
  {
    id: "mahindra-xuv700",
    name: "Mahindra XUV700",
    category: "car",
    brand: "Mahindra",
    rating: 4.7,
    reviews: 150,
    pricePerDay: 3299,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: "/images/photos/v-xuv.jpg",
  },
  {
    id: "honda-city",
    name: "Honda City i-VTEC",
    category: "car",
    brand: "Honda",
    rating: 4.7,
    reviews: 205,
    pricePerDay: 2799,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-swift.jpg",
  },
  {
    id: "hyundai-venue",
    name: "Hyundai Venue",
    category: "car",
    brand: "Hyundai",
    rating: 4.6,
    reviews: 180,
    pricePerDay: 2699,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-creta.jpg",
  },
  {
    id: "maruti-baleno",
    name: "Maruti Baleno",
    category: "car",
    brand: "Maruti",
    rating: 4.5,
    reviews: 240,
    pricePerDay: 2199,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-swift.jpg",
  },
  {
    id: "toyota-fortuner",
    name: "Toyota Fortuner 4x4",
    category: "car",
    brand: "Toyota",
    rating: 4.9,
    reviews: 310,
    pricePerDay: 6999,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: "/images/photos/v-thar.jpg",
  },
  {
    id: "honda-elevate",
    name: "Honda Elevate",
    category: "car",
    brand: "Honda",
    rating: 4.7,
    reviews: 145,
    pricePerDay: 2899,
    fuelType: "Petrol",
    transmission: "Manual",
    image: "/images/photos/v-creta.jpg",
  },
];

export function getVehicleDetails(id: string): VehicleDetail {
  const base = ALL_VEHICLES.find((v) => v.id === id) || ALL_VEHICLES[0];

  // Tailored specs based on category & model
  if (base.category === "bike") {
    return {
      ...base,
      badge: "Popular Choice",
      engineCapacity: base.id.includes("himalayan") ? "411 cc" : base.id.includes("duke") ? "249 cc" : "155 cc",
      maxPower: base.id.includes("himalayan") ? "24.3 bhp @ 6500 rpm" : "30 bhp @ 9000 rpm",
      maxTorque: base.id.includes("himalayan") ? "32 Nm @ 4250 rpm" : "24 Nm @ 7500 rpm",
      mileage: base.id.includes("himalayan") ? "35 kmpl" : "40 kmpl",
      seatingCapacity: "2 Seater",
      kerbWeight: base.id.includes("himalayan") ? "199 kg" : "165 kg",
      fuelTankCapacity: "15 litres",
      brakingSystem: "Dual Channel ABS",
      gallery: [
        base.image,
        "/images/photos/cat-bikes.jpg",
        "/images/photos/red-mountains.jpg",
        "/images/photos/v-himalayan.jpg",
        "/images/photos/v-duke.jpg",
        "/images/photos/banner-sunset.jpg",
      ],
      description: `Built for real adventure. The ${base.name} is designed to take you further — on highways, in the hills, and beyond. Rugged, reliable and ready for any terrain.`,
      aboutText: `The ${base.name} is the perfect companion for explorers. Whether it's a weekend ride or a long highway trip, it offers unmatched comfort, stability and control. With its rugged design and powerful engine, it's ready for every adventure.`,
      highlights: [
        { title: "Rugged Design", desc: "Built for all terrains" },
        { title: "Comfortable Ride", desc: "Long-distance friendly" },
        { title: "Perfect for Trips", desc: "Mountains, highways & more" },
        { title: "Reliable Performance", desc: "Trusted by riders" },
      ],
    };
  }

  if (base.category === "scooter") {
    return {
      ...base,
      badge: "Best City Commuter",
      engineCapacity: base.fuelType === "Electric" ? "3.7 kWh Battery" : "124 cc",
      maxPower: base.fuelType === "Electric" ? "8.5 kW Peak Power" : "8.2 bhp @ 6500 rpm",
      maxTorque: base.fuelType === "Electric" ? "26 Nm Instant Torque" : "10.4 Nm @ 5000 rpm",
      mileage: base.fuelType === "Electric" ? "145 km range" : "50 kmpl",
      seatingCapacity: "2 Seater",
      kerbWeight: "107 kg",
      fuelTankCapacity: base.fuelType === "Electric" ? "Electric Charge" : "5.3 litres",
      brakingSystem: "Combi Brake System (CBS)",
      gallery: [
        base.image,
        "/images/photos/cat-scooters.jpg",
        "/images/photos/v-activa.jpg",
        "/images/photos/v-jupiter.jpg",
        "/images/photos/banner-sunset.jpg",
      ],
      description: `Smooth, effortless, and fuel-efficient city travel with ${base.name}. Ideal for daily commutes, shopping trips, and swift urban mobility.`,
      aboutText: `The ${base.name} is engineered for ultimate urban comfort. Compact, easy to park, and extremely light to maneuver through city traffic. Features spacious under-seat storage and telescopic suspension for smooth rides.`,
      highlights: [
        { title: "High Fuel Efficiency", desc: "Saves big on travel" },
        { title: "Easy Handling", desc: "Lightweight and agile" },
        { title: "Ample Boot Storage", desc: "Store helmets and bags" },
        { title: "Instant Pickup", desc: "Smooth acceleration" },
      ],
    };
  }

  // Cars
  return {
    ...base,
    badge: "Top Rated Car",
    engineCapacity: base.id.includes("thar") || base.id.includes("fortuner") ? "2184 cc Turbo" : "1497 cc i-VTEC",
    maxPower: "130 bhp @ 3750 rpm",
    maxTorque: "300 Nm @ 1600 rpm",
    mileage: base.fuelType === "Diesel" ? "18 kmpl" : "15 kmpl",
    seatingCapacity: base.id.includes("innova") || base.id.includes("fortuner") ? "7 Seater" : "5 Seater",
    kerbWeight: "1750 kg",
    fuelTankCapacity: "57 litres",
    brakingSystem: "All Wheel Disc ABS",
    gallery: [
      base.image,
      "/images/photos/cat-cars.jpg",
      "/images/photos/v-creta.jpg",
      "/images/photos/v-swift.jpg",
      "/images/photos/v-thar.jpg",
      "/images/photos/banner-sunset.jpg",
    ],
    description: `Drive in comfort and premium style with ${base.name}. Equipped with modern infotainment, powerful AC, safety airbags, and spacious seating.`,
    aboutText: `The ${base.name} provides unmatched road presence, plush interiors, and smooth automatic transmission for long family trips, corporate meetings, and weekend getaways.`,
    highlights: [
      { title: "Spacious Cabin", desc: "Plush legroom & luggage space" },
      { title: "Advanced Safety", desc: "Airbags & ABS as standard" },
      { title: "Powerful AC", desc: "Dual zone climate control" },
      { title: "Smooth Automatic", desc: "Effortless highway driving" },
    ],
  };
}

export const FAQ_LIST = [
  {
    question: "What documents do I need to book?",
    answer: "Original Driving License and a valid government ID (Aadhaar or Passport) are required at vehicle pickup.",
  },
  {
    question: "What is the cancellation policy?",
    answer: "Free cancellation up to 24 hours before trip start. 50% refund if cancelled within 24 hours.",
  },
  {
    question: "Is there a security deposit?",
    answer: "A refundable security deposit of ₹1,000 - ₹3,000 (depending on vehicle type) is collected at pickup.",
  },
  {
    question: "Is insurance included?",
    answer: "Yes, basic third-party and comprehensive insurance is included with all rentals.",
  },
  {
    question: "Can I extend my booking?",
    answer: "Yes, extensions can be requested easily via your dashboard or customer support subject to vehicle availability.",
  },
  {
    question: "Can I take the bike to other cities?",
    answer: "Yes! Inter-city travel and outstation road trips are allowed within state & national boundaries.",
  },
];
