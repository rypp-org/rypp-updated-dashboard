"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface UserCoordinates {
  lat: number;
  lng: number;
}

export interface LocationContextType {
  city: string;
  stateName: string;
  coords: UserCoordinates | null;
  isLoading: boolean;
  error: string | null;
  detectLocation: () => Promise<string | null>;
  setCity: (cityName: string) => void;
  availableCities: string[];
}

export const POPULAR_CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Goa",
  "Chandigarh",
  "Kochi",
];

const STORAGE_KEY_CITY = "rypp_user_city";
const STORAGE_KEY_STATE = "rypp_user_state";
const STORAGE_KEY_COORDS = "rypp_user_coords";

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<string>("Bengaluru");
  const [stateName, setStateName] = useState<string>("Karnataka");
  const [coords, setCoords] = useState<UserCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setCity = useCallback((newCity: string, newState?: string) => {
    const trimmed = newCity.trim();
    if (!trimmed) return;
    setCityState(trimmed);
    if (newState) setStateName(newState);
    try {
      localStorage.setItem(STORAGE_KEY_CITY, trimmed);
      if (newState) localStorage.setItem(STORAGE_KEY_STATE, newState);
    } catch {
      // ignore
    }
  }, []);

  // Passive IP Geolocation (no permissions prompt needed)
  const detectLocationPassive = useCallback(async () => {
    try {
      const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.city) {
          setCity(data.city, data.region);
          if (data.latitude && data.longitude) {
            const c = { lat: data.latitude, lng: data.longitude };
            setCoords(c);
            localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(c));
          }
          return;
        }
      }
    } catch {
      try {
        const res2 = await fetch("https://freeipapi.com/api/json", { cache: "no-store" });
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2 && data2.cityName) {
            setCity(data2.cityName, data2.regionName);
            if (data2.latitude && data2.longitude) {
              const c = { lat: data2.latitude, lng: data2.longitude };
              setCoords(c);
              localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(c));
            }
          }
        }
      } catch {
        // Keep default
      }
    }
  }, [setCity]);

  // Initialize from localStorage or fallback
  useEffect(() => {
    try {
      const savedCity = localStorage.getItem(STORAGE_KEY_CITY);
      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      const savedCoords = localStorage.getItem(STORAGE_KEY_COORDS);

      if (savedCity) {
        setCityState(savedCity);
        if (savedState) setStateName(savedState);
        if (savedCoords) {
          try {
            setCoords(JSON.parse(savedCoords));
          } catch {
            // ignore JSON error
          }
        }
      } else {
        // Automatic passive IP-based detection on first visit
        detectLocationPassive();
      }
    } catch {
      // LocalStorage access restricted
    }
  }, [detectLocationPassive]);

  // Active Browser GPS Geolocation + Reverse Geocode
  const detectLocation = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setIsLoading(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const currentCoords = { lat: latitude, lng: longitude };
          setCoords(currentCoords);
          try {
            localStorage.setItem(STORAGE_KEY_COORDS, JSON.stringify(currentCoords));
          } catch {
            // ignore
          }

          let detectedCity = "";
          let detectedState = "";

          // 1. Reverse geocode via BigDataCloud client API (CORS friendly, fast, free)
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (res.ok) {
              const data = await res.json();
              detectedCity =
                data.city ||
                data.locality ||
                data.principalSubdivision ||
                "";
              detectedState = data.principalSubdivision || "";
            }
          } catch {
            // fallback
          }

          // 2. Fallback to OpenStreetMap Nominatim reverse geocode
          if (!detectedCity) {
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              if (res.ok) {
                const data = await res.json();
                const addr = data.address || {};
                detectedCity =
                  addr.city ||
                  addr.town ||
                  addr.village ||
                  addr.state_district ||
                  addr.suburb ||
                  addr.county ||
                  "";
                detectedState = addr.state || "";
              }
            } catch {
              // fallback
            }
          }

          if (detectedCity) {
            setCity(detectedCity, detectedState);
            setIsLoading(false);
            resolve(detectedCity);
          } else {
            // Final fallback to passive IP location
            await detectLocationPassive();
            setIsLoading(false);
            resolve(city);
          }
        },
        async (geoErr) => {
          console.warn("[LocationContext] GPS error or denied:", geoErr.message);
          setError("Location access denied or unavailable. Attempting network estimation...");
          // If browser GPS is denied, fall back seamlessly to IP detection
          await detectLocationPassive();
          setIsLoading(false);
          resolve(city);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, [city, setCity]);

  return (
    <LocationContext.Provider
      value={{
        city,
        stateName,
        coords,
        isLoading,
        error,
        detectLocation,
        setCity,
        availableCities: POPULAR_CITIES,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
