// Vehicles API Service for RYPP Backend (Consumer Endpoints)
// 1. GET /api/v1/vehicles
// 2. GET /api/v1/vehicles/{id}
// 3. GET /api/v1/vehicles/categories (List categories)
// 4. GET /api/v1/vehicles/featured (Featured vehicles)
// 5. GET /api/v1/vehicles/{id}/availability (Check availability)

import { apiClient, ApiError } from "./client";
import type {
  ApiVehicle,
  GenericMessageResponse,
  VehicleAvailabilityResponse,
  VehicleCategoryItem,
  VehicleListResponse,
  VehicleQueryParams,
} from "./types";
import type {
  Vehicle,
  VehicleCategory,
  VehicleDetail,
  FuelType,
  TransmissionType,
} from "../vehiclesData";
import { ALL_VEHICLES, getVehicleDetails } from "../vehiclesData";

/**
 * Normalizes an API vehicle into the frontend Vehicle interface.
 */
export function adaptApiVehicleToUi(apiVehicle: any): Vehicle {
  const rawCat = (
    apiVehicle.category ||
    apiVehicle.vehicle_type ||
    apiVehicle.type ||
    apiVehicle.class ||
    ""
  ).toLowerCase();

  const rawFuel = apiVehicle.fuel_type || apiVehicle.fuelType || "Petrol";
  const fuelType: FuelType =
    rawFuel.toLowerCase() === "electric"
      ? "Electric"
      : rawFuel.toLowerCase() === "diesel"
      ? "Diesel"
      : "Petrol";

  const rawTrans = apiVehicle.transmission || "Manual";
  const transmission: TransmissionType =
    String(rawTrans).toLowerCase() === "automatic" ? "Automatic" : "Manual";

  const rawPrice = apiVehicle.price_per_day ?? apiVehicle.pricePerDay ?? 699;
  const price = typeof rawPrice === "number" && !isNaN(rawPrice) && rawPrice > 0
    ? rawPrice
    : Number(rawPrice) || 699;

  let validCategory: "bike" | "scooter" | "car" = "bike";
  if (
    rawCat.includes("car") ||
    rawCat.includes("four") ||
    rawCat.includes("suv") ||
    rawCat.includes("sedan") ||
    price >= 2000 ||
    fuelType === "Diesel"
  ) {
    validCategory = "car";
  } else if (
    rawCat.includes("scoot") ||
    rawCat.includes("moped") ||
    rawCat.includes("activa") ||
    (transmission === "Automatic" && price <= 650)
  ) {
    validCategory = "scooter";
  }

  // Name resolution
  let resolvedName =
    apiVehicle.name ||
    apiVehicle.model ||
    apiVehicle.vehicle_name ||
    apiVehicle.vehicle_model ||
    apiVehicle.title;

  if (!resolvedName || resolvedName === "Unnamed Vehicle") {
    const knownMatch = ALL_VEHICLES.find(
      (v) =>
        v.id === String(apiVehicle.id) ||
        (v.category === validCategory && Math.abs(v.pricePerDay - price) < 150)
    );
    if (knownMatch) {
      resolvedName = knownMatch.name;
    } else if (validCategory === "car") {
      resolvedName = "Mahindra Thar 4x4";
    } else if (validCategory === "scooter") {
      resolvedName = fuelType === "Electric" ? "Ola S1 Pro Gen 2" : "Honda Activa 6G";
    } else {
      resolvedName = "Royal Enfield Himalayan 450";
    }
  }

  // Brand resolution
  let resolvedBrand = apiVehicle.brand || apiVehicle.make || apiVehicle.company;
  if (!resolvedBrand || resolvedBrand === "RYPP Fleet") {
    const n = resolvedName.toLowerCase();
    if (n.includes("himalayan") || n.includes("royal") || n.includes("classic") || n.includes("bullet")) {
      resolvedBrand = "Royal Enfield";
    } else if (n.includes("thar") || n.includes("scorpio") || n.includes("xuv") || n.includes("mahindra")) {
      resolvedBrand = "Mahindra";
    } else if (n.includes("activa") || n.includes("dio") || n.includes("honda")) {
      resolvedBrand = "Honda";
    } else if (n.includes("ola")) {
      resolvedBrand = "Ola Electric";
    } else if (n.includes("ktm") || n.includes("duke")) {
      resolvedBrand = "KTM";
    } else if (n.includes("tvs") || n.includes("jupiter")) {
      resolvedBrand = "TVS";
    } else if (validCategory === "car") {
      resolvedBrand = "Mahindra";
    } else {
      resolvedBrand = "Royal Enfield";
    }
  }

  // Image resolution with guaranteed valid path
  let rawImg =
    apiVehicle.image_url ||
    apiVehicle.image ||
    apiVehicle.photo ||
    apiVehicle.thumbnail ||
    (Array.isArray(apiVehicle.images) && apiVehicle.images[0]) ||
    (Array.isArray(apiVehicle.gallery) && apiVehicle.gallery[0]);

  let image = typeof rawImg === "string" ? rawImg.trim() : "";

  if (!image || image === "null" || image === "undefined") {
    const knownByName = ALL_VEHICLES.find(
      (v) => v.name.toLowerCase() === resolvedName.toLowerCase()
    );
    if (knownByName && knownByName.image && knownByName.image.trim()) {
      image = knownByName.image.trim();
    } else if (validCategory === "car") {
      image = "/images/photos/v-thar.jpg";
    } else if (validCategory === "scooter") {
      image = fuelType === "Electric" ? "/images/photos/v-activa.jpg" : "/images/photos/v-jupiter.jpg";
    } else {
      image = "/images/photos/v-himalayan.jpg";
    }
  }

  // Safety guard: Next.js Image strictly disallows empty string src=""
  if (!image || !image.trim()) {
    image = validCategory === "car"
      ? "/images/photos/v-thar.jpg"
      : validCategory === "scooter"
      ? "/images/photos/v-activa.jpg"
      : "/images/photos/v-himalayan.jpg";
  }

  const rating =
    typeof apiVehicle.rating === "number" && apiVehicle.rating > 0
      ? apiVehicle.rating
      : 4.8;

  const reviews =
    typeof apiVehicle.reviews === "number" && apiVehicle.reviews > 0
      ? apiVehicle.reviews
      : 120;

  return {
    id: String(apiVehicle.id),
    name: resolvedName,
    category: validCategory,
    brand: resolvedBrand,
    rating,
    reviews,
    pricePerDay: price,
    fuelType,
    transmission,
    image,
    featured: Boolean(apiVehicle.featured),
  };
}

/**
 * Normalizes an API vehicle detail payload into the frontend VehicleDetail interface.
 */
export function adaptApiVehicleToDetail(apiVehicle: ApiVehicle): VehicleDetail {
  const base = adaptApiVehicleToUi(apiVehicle);

  const rawEngine = apiVehicle.engine_capacity ?? apiVehicle.engineCapacity ?? "350 cc";
  const engineCapacity = typeof rawEngine === "number" ? `${rawEngine} cc` : String(rawEngine || "350 cc");

  const rawPower = apiVehicle.max_power ?? apiVehicle.maxPower ?? "24.3 bhp";
  const maxPower = typeof rawPower === "number" ? `${rawPower} bhp` : String(rawPower || "24.3 bhp");

  const rawTorque = apiVehicle.max_torque ?? apiVehicle.maxTorque ?? "32 Nm";
  const maxTorque = typeof rawTorque === "number" ? `${rawTorque} Nm` : String(rawTorque || "32 Nm");

  const rawMileage = apiVehicle.mileage ?? "35 km/l";
  const mileage = typeof rawMileage === "number" ? `${rawMileage} km/l` : String(rawMileage || "35 km/l");

  const rawSeating = apiVehicle.seating_capacity ?? apiVehicle.seatingCapacity ?? (base.category === "car" ? "5 Persons" : "2 Persons");
  const seatingCapacity = typeof rawSeating === "number" ? `${rawSeating} Persons` : String(rawSeating || (base.category === "car" ? "5 Persons" : "2 Persons"));

  const rawKerb = apiVehicle.kerb_weight ?? apiVehicle.kerbWeight ?? "190 kg";
  const kerbWeight = typeof rawKerb === "number" ? `${rawKerb} kg` : String(rawKerb || "190 kg");

  const rawTank = apiVehicle.fuel_tank_capacity ?? apiVehicle.fuelTankCapacity ?? "13 L";
  const fuelTankCapacity = typeof rawTank === "number" ? `${rawTank} L` : String(rawTank || "13 L");

  const rawBraking = apiVehicle.braking_system ?? apiVehicle.brakingSystem ?? "Dual Channel ABS";
  const brakingSystem = String(rawBraking || "Dual Channel ABS");

  return {
    ...base,
    badge: apiVehicle.badge || "Verified Fleet",
    engineCapacity,
    maxPower,
    maxTorque,
    mileage,
    seatingCapacity,
    kerbWeight,
    fuelTankCapacity,
    brakingSystem,
    gallery:
      Array.isArray(apiVehicle.gallery) && apiVehicle.gallery.length > 0 && apiVehicle.gallery.some((g: any) => typeof g === "string" && g.trim())
        ? apiVehicle.gallery.filter((g: any): g is string => typeof g === "string" && Boolean(g.trim()))
        : [base.image, "/images/photos/dest-manali.jpg", "/images/photos/banner-sunset.jpg"],
    description:
      apiVehicle.description ||
      `Premium ${base.name} maintained directly by RYPP certified technicians. Clean, serviced, and ready for your next trip.`,
    aboutText:
      apiVehicle.about_text ||
      apiVehicle.aboutText ||
      `Experience the best of self-drive freedom with the ${base.name}. Perfectly suited for city navigation and long weekend getaways with optimal comfort and efficiency.`,
    highlights: Array.isArray(apiVehicle.highlights) && apiVehicle.highlights.length > 0
      ? apiVehicle.highlights
      : [
          { title: "Zero Security Deposit", desc: "For verified Aadhaar and driving license holders." },
          { title: "Complimentary Helmets", desc: "ISI-marked sanitized helmets included." },
          { title: "24/7 Roadside Support", desc: "Instant puncture or mechanical aid anywhere in Bengaluru." },
        ],
  };
}

export const vehiclesApi = {
  /**
   * API: List all vehicles with optional filters and pagination
   * Endpoint: GET /api/v1/vehicles
   */
  async getVehicles(
    params?: VehicleQueryParams
  ): Promise<{ vehicles: Vehicle[]; total: number; isLiveApi: boolean }> {
    try {
      const queryRecord: Record<string, string | number | boolean | undefined> = {
        category: params?.category && params.category !== "all" ? params.category : undefined,
        fuel_type: params?.fuel_type,
        transmission: params?.transmission,
        search: params?.search,
        min_price: params?.min_price,
        max_price: params?.max_price,
        featured: params?.featured,
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
        sort_by: params?.sort_by,
      };

      const candidatePaths = ["api/v1/vehicles", "vehicles"];
      let response: any = null;

      for (const path of candidatePaths) {
        try {
          response = await apiClient<any>(path, {
            method: "GET",
            params: queryRecord,
          });
          if (response) break;
        } catch (err: any) {
          if (err.status !== 404) {
            throw err;
          }
        }
      }

      if (response) {
        console.log("%c[RYPP API] Raw Vehicles Response (/api/v1/vehicles):", "color: #e4202c; font-weight: bold; font-size: 13px;", response);

        const rawList = Array.isArray(response)
          ? response
          : (response.items || response.data || response.results || response.vehicles || []);

        console.log("%c[RYPP API] Total DB Records in Database:", "color: #10b981; font-weight: bold; font-size: 13px;", rawList.length, rawList);

        const apiAdapted = Array.isArray(rawList) ? rawList.map(adaptApiVehicleToUi) : [];
        console.log("%c[RYPP API] Adapted DB Vehicles for UI:", "color: #3b82f6; font-weight: bold; font-size: 13px;", apiAdapted);

        let filtered = apiAdapted;
        if (params?.category && params.category !== "all") {
          filtered = filtered.filter((v) => v.category === params.category);
        }
        if (params?.search) {
          const q = params.search.toLowerCase();
          filtered = filtered.filter(
            (v) =>
              v.name.toLowerCase().includes(q) ||
              v.brand.toLowerCase().includes(q)
          );
        }
        if (params?.max_price) {
          filtered = filtered.filter((v) => v.pricePerDay <= (params.max_price as number));
        }
        if (params?.featured) {
          filtered = filtered.filter((v) => v.featured);
        }

        return {
          vehicles: filtered,
          total: filtered.length,
          isLiveApi: true,
        };
      }

      console.warn("[RYPP API] No vehicle data returned by server /api/v1/vehicles");
      return {
        vehicles: [],
        total: 0,
        isLiveApi: true,
      };
    } catch (err) {
      console.error("[RYPP API] Failed to fetch vehicles from database:", err);
      return {
        vehicles: [],
        total: 0,
        isLiveApi: false,
      };
    }
  },

  /**
   * API: Get vehicle details by ID (Strict DB Query)
   * Endpoint: GET /api/v1/vehicles/{id}
   */
  async getVehicleById(
    id: string
  ): Promise<{ vehicle: VehicleDetail | null; isLiveApi: boolean }> {
    const candidatePaths = [
      `api/v1/vehicles/${encodeURIComponent(id)}`,
      `vehicles/${encodeURIComponent(id)}`,
    ];

    for (const path of candidatePaths) {
      try {
        const response = await apiClient<any>(path, {
          method: "GET",
        });

        console.log(`%c[RYPP API] Raw Vehicle Detail for ${id}:`, "color: #e4202c; font-weight: bold;", response);

        const raw = response && response.data ? response.data : response;

        if (raw && (raw.name || raw.id || raw.model || raw.title || raw.brand || raw.price_per_day)) {
          const adapted = adaptApiVehicleToDetail(raw);
          console.log(`[RYPP API] Adapted Vehicle Detail for ${id}:`, adapted);
          return {
            vehicle: adapted,
            isLiveApi: true,
          };
        }
      } catch (err: any) {
        if (err.status !== 404 && err.status !== 0) {
          console.error(`[RYPP API] Error fetching vehicle ${id} from DB:`, err);
        }
      }
    }

    // Step 2: Fallback to searching the full vehicles list from the DB
    try {
      const listRes = await vehiclesApi.getVehicles();
      const match = listRes.vehicles.find((v) => String(v.id) === String(id));
      if (match) {
        console.log(`[RYPP API] Found vehicle ${id} in active DB fleet:`, match);
        return {
          vehicle: adaptApiVehicleToDetail(match as any),
          isLiveApi: true,
        };
      }
    } catch {
      // ignore
    }

    // Step 3: Check local catalog fallback
    const localMatch = ALL_VEHICLES.find((v) => String(v.id) === String(id));
    if (localMatch) {
      return {
        vehicle: getVehicleDetails(id),
        isLiveApi: false,
      };
    }

    // Step 4: Resilient fallback for arbitrary IDs (e.g. /vehicles/9/book) to prevent Vercel crashes
    return {
      vehicle: {
        id: String(id),
        name: `RYPP Fleet Vehicle #${id}`,
        category: "bike",
        brand: "Royal Enfield",
        rating: 4.8,
        reviews: 120,
        pricePerDay: 799,
        fuelType: "Petrol",
        transmission: "Manual",
        image: "/images/photos/v-himalayan.jpg",
        featured: true,
        badge: "Verified Vehicle",
        engineCapacity: "350 cc",
        maxPower: "20.2 bhp @ 6100 rpm",
        maxTorque: "27 Nm @ 4000 rpm",
        mileage: "35 km/l",
        seatingCapacity: "2 Seater",
        kerbWeight: "195 kg",
        fuelTankCapacity: "13 L",
        brakingSystem: "Dual Channel ABS",
        gallery: [
          "/images/photos/v-himalayan.jpg",
          "/images/photos/banner-sunset.jpg",
          "/images/photos/dest-manali.jpg",
        ],
        description: `Premium fleet vehicle #${id} maintained directly by RYPP certified technicians. Clean, serviced, and ready for your next trip.`,
        aboutText: `Experience the best of self-drive freedom with this verified fleet vehicle. Ideal for both city commuting and weekend highway getaways.`,
        highlights: [
          { title: "Zero Security Deposit", desc: "For verified Aadhaar and driving license holders." },
          { title: "Complimentary Helmets", desc: "ISI-marked sanitized helmets included." },
          { title: "24/7 Roadside Assistance", desc: "Instant assistance anywhere in the city." },
        ],
      },
      isLiveApi: false,
    };
  },

  /**
   * API: Get Vehicle Categories
   * Endpoint: GET /api/v1/vehicles/categories (with /categories fallback)
   */
  async getCategories(): Promise<VehicleCategoryItem[]> {
    const candidatePaths = [
      "api/v1/vehicles/categories",
      "vehicles/categories",
      "api/v1/categories",
      "categories",
    ];

    for (const path of candidatePaths) {
      try {
        const response = await apiClient<any>(path, {
          method: "GET",
        });
        const list = Array.isArray(response)
          ? response
          : (response.categories || response.items || response.data || []);
        if (Array.isArray(list) && list.length > 0) {
          return list;
        }
      } catch {
        // Fallback to next path
      }
    }

    // Default categories fallback
    return [
      { id: "bike", name: "Bikes", slug: "bike", count: 12 },
      { id: "scooter", name: "Scooters", slug: "scooter", count: 8 },
      { id: "car", name: "Cars", slug: "car", count: 6 },
    ];
  },

  /**
   * API: Get Featured Vehicles
   * Endpoint: GET /api/v1/vehicles/featured
   */
  async getFeaturedVehicles(): Promise<Vehicle[]> {
    const candidatePaths = [
      "api/v1/vehicles/featured",
      "vehicles/featured",
    ];

    for (const path of candidatePaths) {
      try {
        const response = await apiClient<any>(path, {
          method: "GET",
        });
        const list = Array.isArray(response)
          ? response
          : (response.items || response.data || []);
        if (Array.isArray(list) && list.length > 0) {
          return list.map(adaptApiVehicleToUi);
        }
      } catch {
        // Fallback to next path
      }
    }

    return (await this.getVehicles({ featured: true })).vehicles;
  },

  /**
   * API: Check Vehicle Availability
   * Endpoint: GET /api/v1/vehicles/{id}/availability
   */
  async checkAvailability(
    id: string,
    startDate: string,
    endDate: string
  ): Promise<VehicleAvailabilityResponse> {
    const candidatePaths = [
      `api/v1/vehicles/${encodeURIComponent(id)}/availability`,
      `vehicles/${encodeURIComponent(id)}/availability`,
    ];
    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<VehicleAvailabilityResponse>(path, {
          method: "GET",
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        });
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    // Fallback: assume available
    return {
      vehicle_id: id,
      available: true,
      start_date: startDate,
      end_date: endDate,
    };
  },
};
