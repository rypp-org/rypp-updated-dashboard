// API Types for RYPP Backend (https://api.rypp.in)

export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string;
  created_at?: string;
  is_verified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  refresh_token?: string;
  user?: UserProfile;
  message?: string;
  detail?: string;
  status?: string;
  requires_verification?: boolean;
  email?: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refresh_token?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token?: string;
  otp?: string;
  email?: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface SendOtpRequest {
  phone?: string;
  email?: string;
  identifier?: string;
  type?: "email" | "phone" | "mobile";
}

export interface VerifyOtpRequest {
  phone?: string;
  email?: string;
  identifier?: string;
  otp: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
  email?: string;
}

export interface ApiVehicleHighlight {
  title: string;
  desc: string;
}

export interface ApiVehicle {
  id: string | number;
  name: string;
  brand?: string;
  category: "bike" | "scooter" | "car" | string;
  rating?: number;
  reviews?: number;
  price_per_day?: number;
  pricePerDay?: number;
  fuel_type?: "Petrol" | "Diesel" | "Electric" | string;
  fuelType?: "Petrol" | "Diesel" | "Electric" | string;
  transmission?: "Manual" | "Automatic" | string;
  image?: string;
  image_url?: string;
  gallery?: string[];
  featured?: boolean;
  status?: "available" | "booked" | "maintenance" | string;
  badge?: string;
  engine_capacity?: string;
  engineCapacity?: string;
  max_power?: string;
  maxPower?: string;
  max_torque?: string;
  maxTorque?: string;
  mileage?: string;
  seating_capacity?: string;
  seatingCapacity?: string;
  kerb_weight?: string;
  kerbWeight?: string;
  fuel_tank_capacity?: string;
  fuelTankCapacity?: string;
  braking_system?: string;
  brakingSystem?: string;
  description?: string;
  about_text?: string;
  aboutText?: string;
  highlights?: ApiVehicleHighlight[];
  location?: string;
}


export interface VehicleQueryParams {
  category?: string;
  fuel_type?: string;
  transmission?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort_by?: "recommended" | "price_asc" | "price_desc" | "rating" | string;
}

export interface VehicleListResponse {
  items: ApiVehicle[];
  total: number;
  page: number;
  limit: number;
  total_pages?: number;
}

export interface VehicleCategoryItem {
  id: string;
  name: string;
  slug: "bike" | "scooter" | "car" | string;
  count?: number;
  icon?: string;
  image?: string;
}

export interface VehicleAvailabilityResponse {
  vehicle_id: string;
  available: boolean;
  start_date: string;
  end_date: string;
  blocked_dates?: string[];
  price_total?: number;
}

export interface GenericMessageResponse {
  message: string;
  success?: boolean;
  status?: string;
}

export interface ApiErrorResponse {
  detail?: string | Array<{ msg: string; loc: string[] }>;
  message?: string;
  error?: string;
}
