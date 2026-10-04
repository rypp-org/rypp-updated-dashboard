// Every picture on the landing page is looked up here.
// Photos live in /public/images/photos (credits in CREDITS.md there); hero1.png is supplied by the client.
// To use real photography, drop a file into /public/images and change the path.
export const images = {
  hero: "/images/photos/hero1.png",
  bannerSunset: "/images/photos/banner-sunset.jpg",
  vision: "/images/photos/vision.jpg",
  cta: "/images/photos/cta.jpg",
  redMountains: "/images/photos/red-mountains.jpg",
  categories: {
    bikes: "/images/photos/cat-bikes.jpg",
    scooters: "/images/photos/cat-scooters.jpg",
    cars: "/images/photos/cat-cars.jpg",
  },
  destinations: {
    bengaluru: "/images/photos/dest-bengaluru.jpg",
    coorg: "/images/photos/dest-coorg.jpg",
    goa: "/images/photos/dest-goa.jpg",
    manali: "/images/photos/dest-manali.jpg",
    rishikesh: "/images/photos/dest-rishikesh.jpg",
    jaipur: "/images/photos/dest-jaipur.jpg",
  },
  avatars: {
    amit: "/images/avatar-amit.svg",
    priya: "/images/avatar-priya.svg",
    rohan: "/images/avatar-rohan.svg",
    sneha: "/images/avatar-sneha.svg",
  },
} as const;
