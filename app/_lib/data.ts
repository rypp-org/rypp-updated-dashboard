import { images } from "./images";

export type VehicleCategory = "bike" | "scooter" | "car";

export type Vehicle = {
  id: string;
  name: string;
  category: VehicleCategory;
  rating: number;
  reviews: string;
  pricePerDay: number;
  image: string;
  /** shown in the default "featured" lineup */
  featured?: boolean;
};

export const vehicles: Vehicle[] = [
  { id: "re-classic-350", name: "Royal Enfield Classic 350", category: "bike", rating: 4.8, reviews: "320+", pricePerDay: 799, image: "/images/photos/v-classic.jpg", featured: true },
  { id: "ktm-duke-250", name: "KTM Duke 250", category: "bike", rating: 4.6, reviews: "198+", pricePerDay: 899, image: "/images/photos/v-duke.jpg", featured: true },
  { id: "yamaha-r15-v4", name: "Yamaha R15 V4", category: "bike", rating: 4.7, reviews: "210+", pricePerDay: 899, image: "/images/photos/v-r15.jpg", featured: true },
  { id: "honda-activa-125", name: "Honda Activa 125", category: "scooter", rating: 4.5, reviews: "180+", pricePerDay: 499, image: "/images/photos/v-activa.jpg", featured: true },
  { id: "maruti-swift", name: "Maruti Swift", category: "car", rating: 4.6, reviews: "310+", pricePerDay: 2499, image: "/images/photos/v-swift.jpg", featured: true },
  { id: "hyundai-creta", name: "Hyundai Creta", category: "car", rating: 4.8, reviews: "420+", pricePerDay: 2999, image: "/images/photos/v-creta.jpg", featured: true },
  { id: "re-himalayan", name: "Royal Enfield Himalayan", category: "bike", rating: 4.7, reviews: "260+", pricePerDay: 1199, image: "/images/photos/v-himalayan.jpg" },
  { id: "tvs-jupiter", name: "TVS Jupiter 125", category: "scooter", rating: 4.4, reviews: "140+", pricePerDay: 449, image: "/images/photos/v-jupiter.jpg" },
  { id: "mahindra-thar", name: "Mahindra Thar", category: "car", rating: 4.8, reviews: "390+", pricePerDay: 3499, image: "/images/photos/v-thar.jpg" },
  { id: "mahindra-xuv700", name: "Mahindra XUV700", category: "car", rating: 4.7, reviews: "150+", pricePerDay: 3299, image: "/images/photos/v-xuv.jpg" },
];

export const categories = [
  { name: "Bikes", tagline: "For every adventure", image: images.categories.bikes, focus: "50% 82%" },
  { name: "Scooters", tagline: "Simple. Smart. Reliable.", image: images.categories.scooters, focus: "50% 55%" },
  { name: "Cars", tagline: "For every journey", image: images.categories.cars, focus: "50% 75%" },
];

export const destinations = [
  { name: "Bengaluru", tagline: "City Rides", image: images.destinations.bengaluru },
  { name: "Coorg", tagline: "Nature Escapes", image: images.destinations.coorg },
  { name: "Goa", tagline: "Beach Vibes", image: images.destinations.goa },
  { name: "Manali", tagline: "Mountain Trails", image: images.destinations.manali },
  { name: "Rishikesh", tagline: "Spiritual Journeys", image: images.destinations.rishikesh },
  { name: "Jaipur", tagline: "Royal Experiences", image: images.destinations.jaipur },
];

export const steps = [
  { n: "01", title: "Choose Vehicle", text: "Browse bikes, scooters or cars as per your need." },
  { n: "02", title: "Select Date & Location", text: "Pick your trip dates and location." },
  { n: "03", title: "Book & Pay", text: "Confirm your booking with secure payment." },
  { n: "04", title: "Ride & Enjoy", text: "Pick up your vehicle and start your journey." },
];

export const testimonials = [
  {
    quote: "RYPP made my trip to Coorg unforgettable. Easy booking, great vehicle and zero hassle!",
    name: "Amit Sharma",
    role: "Traveler, Bengaluru",
    avatar: images.avatars.amit,
  },
  {
    quote: "Picked up a Thar for our Manali road trip in minutes. The vehicle was spotless and support was always a call away.",
    name: "Priya Nair",
    role: "Photographer, Kochi",
    avatar: images.avatars.priya,
  },
  {
    quote: "I use RYPP scooters for my daily commute now. Cheaper than owning one and totally hassle-free.",
    name: "Rohan Mehta",
    role: "Designer, Pune",
    avatar: images.avatars.rohan,
  },
  {
    quote: "Verified partners, transparent pricing and a smooth handover. Exactly how rentals should work.",
    name: "Sneha Kulkarni",
    role: "Product Manager, Mumbai",
    avatar: images.avatars.sneha,
  },
];

export const stats = [
  { value: "10K+", label: "Happy Riders" },
  { value: "500+", label: "Vehicles on Platform" },
  { value: "50+", label: "Cities (Upcoming)" },
  { value: "4.8", label: "Average Rating" },
  { value: "100%", label: "Verified Partners" },
];

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Vehicles", href: "/#vehicles" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Career", href: "/#contact" },
  { label: "Contact", href: "/#contact" },
];
