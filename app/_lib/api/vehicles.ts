// Vehicles API Service for RYPP Backend (All Endpoints)
// 1. GET    /api/v1/vehicles
// 2. GET    /api/v1/vehicles/{id}
// 3. POST   /api/v1/vehicles (Create new vehicle)
// 4. PUT    /api/v1/vehicles/{id} (Update vehicle)
// 5. DELETE /api/v1/vehicles/{id} (Delete vehicle)
// 6. GET    /api/v1/vehicles/categories (List categories)
// 7. GET    /api/v1/vehicles/featured (Featured vehicles)
// 8. GET    /api/v1/vehicles/{id}/availability (Check availability)

import { apiClient, ApiError } from "./client";
import type {
  ApiVehicle,
  CreateVehicleInput,
  GenericMessageResponse,
  UpdateVehicleInput,
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
export function adaptApiVehicleToUi(apiVehicle: ApiVehicle): Vehicle {
  const category = (apiVehicle.category || "bike").toLowerCase() as "bike" | "scooter" | "car";
  const validCategory = ["bike", "scooter", "car"].includes(category)
    ? category
    : "bike";

  const rawFuel = apiVehicle.fuel_type || apiVehicle.fuelType || "Petrol";
  const fuelType: FuelType =
    rawFuel.toLowerCase() === "electric"
      ? "Electric"
      : rawFuel.toLowerCase() === "diesel"
      ? "Diesel"
      : "Petrol";

  const rawTrans = apiVehicle.transmission || "Manual";
  const transmission: TransmissionType =
    rawTrans.toLowerCase() === "automatic" ? "Automatic" : "Manual";

  const defaultImage =
    validCategory === "car"
      ? "/images/photos/v-thar.jpg"
      : validCategory === "scooter"
      ? "/images/photos/v-activa.jpg"
      : "/images/photos/v-himalayan.jpg";

  return {
    id: String(apiVehicle.id),
    name: apiVehicle.name || "Unnamed Vehicle",
    category: validCategory,
    brand: apiVehicle.brand || "RYPP Fleet",
    rating: typeof apiVehicle.rating === "number" ? apiVehicle.rating : 4.8,
    reviews: typeof apiVehicle.reviews === "number" ? apiVehicle.reviews : 120,
    pricePerDay: apiVehicle.price_per_day ?? apiVehicle.pricePerDay ?? 699,
    fuelType,
    transmission,
    image: apiVehicle.image_url || apiVehicle.image || defaultImage,
    featured: Boolean(apiVehicle.featured),
  };
}

/**
 * Normalizes an API vehicle detail payload into the frontend VehicleDetail interface.
 */
export function adaptApiVehicleToDetail(apiVehicle: ApiVehicle): VehicleDetail {
  const base = adaptApiVehicleToUi(apiVehicle);

  return {
    ...base,
    badge: apiVehicle.badge || "Verified Fleet",
    engineCapacity:
      apiVehicle.engine_capacity || apiVehicle.engineCapacity || "350 cc",
    maxPower: apiVehicle.max_power || apiVehicle.maxPower || "24.3 bhp",
    maxTorque: apiVehicle.max_torque || apiVehicle.maxTorque || "32 Nm",
    mileage: apiVehicle.mileage || "35 km/l",
    seatingCapacity:
      apiVehicle.seating_capacity || apiVehicle.seatingCapacity || (base.category === "car" ? "5 Persons" : "2 Persons"),
    kerbWeight: apiVehicle.kerb_weight || apiVehicle.kerbWeight || "190 kg",
    fuelTankCapacity:
      apiVehicle.fuel_tank_capacity || apiVehicle.fuelTankCapacity || "13 L",
    brakingSystem:
      apiVehicle.braking_system || apiVehicle.brakingSystem || "Dual Channel ABS",
    gallery:
      apiVehicle.gallery && apiVehicle.gallery.length > 0
        ? apiVehicle.gallery
        : [base.image, "/images/photos/dest-manali.jpg", "/images/photos/banner-sunset.jpg"],
    description:
      apiVehicle.description ||
      `Premium ${base.name} maintained directly by RYPP certified technicians. Clean, serviced, and ready for your next trip.`,
    aboutText:
      apiVehicle.about_text ||
      apiVehicle.aboutText ||
      `Experience the best of self-drive freedom with the ${base.name}. Perfectly suited for city navigation and long weekend getaways with optimal comfort and efficiency.`,
    highlights: apiVehicle.highlights || [
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
        limit: params?.limit ?? 20,
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
        const rawList = Array.isArray(response)
          ? response
          : (response.items || response.data || response.results || response.vehicles || []);

        if (Array.isArray(rawList) && rawList.length > 0) {
          return {
            vehicles: rawList.map(adaptApiVehicleToUi),
            total: Array.isArray(response) ? rawList.length : (response.total ?? response.count ?? rawList.length),
            isLiveApi: true,
          };
        }

        return {
          vehicles: [],
          total: 0,
          isLiveApi: true,
        };
      }

      throw new Error("Vehicles endpoint not found");
    } catch (err) {
      console.warn("Live API /api/v1/vehicles unavailable, using local fleet data:", err);

      let filtered = [...ALL_VEHICLES];
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
        isLiveApi: false,
      };
    }
  },

  /**
   * API: Get vehicle details by ID
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

        const raw = response && response.data ? response.data : response;

        if (raw && (raw.name || raw.id)) {
          return {
            vehicle: adaptApiVehicleToDetail(raw),
            isLiveApi: true,
          };
        }
      } catch (err: any) {
        if (err.status !== 404 && err.status !== 0) {
          console.warn(`Live API ${path} error:`, err);
        }
      }
    }

    const local = getVehicleDetails(id);
    return {
      vehicle: local,
      isLiveApi: false,
    };
  },

  /**
   * API: Create a new vehicle in fleet
   * Endpoint: POST /api/v1/vehicles
   */
  async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
    const candidatePaths = ["api/v1/vehicles", "vehicles"];
    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const response = await apiClient<any>(path, {
          method: "POST",
          body: JSON.stringify(data),
        });
        const raw = response && response.data ? response.data : response;
        return adaptApiVehicleToUi(raw);
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError("Failed to create vehicle", 500);
  },

  /**
   * API: Update vehicle details
   * Endpoint: PUT /api/v1/vehicles/{id} or PATCH /api/v1/vehicles/{id}
   */
  async updateVehicle(id: string, data: UpdateVehicleInput): Promise<Vehicle> {
    const candidatePaths = [
      `api/v1/vehicles/${encodeURIComponent(id)}`,
      `vehicles/${encodeURIComponent(id)}`,
    ];
    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        const response = await apiClient<any>(path, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        const raw = response && response.data ? response.data : response;
        return adaptApiVehicleToUi(raw);
      } catch (err: any) {
        if (err.status === 405) {
          // If PUT not supported, try PATCH
          try {
            const patchRes = await apiClient<any>(path, {
              method: "PATCH",
              body: JSON.stringify(data),
            });
            const raw = patchRes && patchRes.data ? patchRes.data : patchRes;
            return adaptApiVehicleToUi(raw);
          } catch (patchErr) {
            lastError = patchErr;
          }
        } else {
          lastError = err;
        }

        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError(`Failed to update vehicle ${id}`, 500);
  },

  /**
   * API: Delete vehicle from fleet
   * Endpoint: DELETE /api/v1/vehicles/{id}
   */
  async deleteVehicle(id: string): Promise<GenericMessageResponse> {
    const candidatePaths = [
      `api/v1/vehicles/${encodeURIComponent(id)}`,
      `vehicles/${encodeURIComponent(id)}`,
    ];
    let lastError: any = null;

    for (const path of candidatePaths) {
      try {
        return await apiClient<GenericMessageResponse>(path, {
          method: "DELETE",
        });
      } catch (err: any) {
        lastError = err;
        if (err.status !== 404 && err.status !== 0) {
          throw err;
        }
      }
    }

    throw lastError || new ApiError(`Failed to delete vehicle ${id}`, 500);
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
