"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bike,
  Car,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Star,
  Heart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Calendar,
  Headphones,
  SlidersHorizontal,
  X,
  RotateCcw,
  RefreshCw,
  Activity,
} from "lucide-react";
import {
  FuelType,
  TransmissionType,
  VehicleCategory,
  type Vehicle,
} from "../../_lib/vehiclesData";
import { vehiclesApi } from "../../_lib/api/vehicles";
import { Container } from "../../_components/ui";

// Custom Scooter SVG Icon for header pills
function ScooterIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 18h7l3-9h3" />
      <path d="M16 9l-2-5h-4" />
      <path d="M9 18v-4h3" />
    </svg>
  );
}

export function VehiclesPageContent() {
  // --- Live API States ---
  const [apiVehicles, setApiVehicles] = useState<Vehicle[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState<boolean>(true);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);

  // --- Filtering & UI States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>("all");
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [selectedFuel, setSelectedFuel] = useState<FuelType[]>([]);
  const [selectedTransmission, setSelectedTransmission] = useState<TransmissionType[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Modals & Drawers
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Accordion Section Collapse States
  const [openAccordion, setOpenAccordion] = useState({
    vehicleType: true,
    priceRange: true,
    fuelType: true,
    transmission: true,
    brand: true,
  });

  const fetchVehicles = useCallback(async () => {
    setIsLoadingVehicles(true);
    try {
      const res = await vehiclesApi.getVehicles({
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        max_price: maxPrice,
        sort_by: sortBy,
      });
      console.log("%c[VehiclesPage] Loaded DB Vehicles from API:", "color: #10b981; font-weight: bold; font-size: 13px;", res.vehicles);
      setApiVehicles(res.vehicles);
      setIsLiveApi(res.isLiveApi);
    } catch (err) {
      console.error("[VehiclesPage] Failed to load vehicles from API:", err);
    } finally {
      setIsLoadingVehicles(false);
    }
  }, [selectedCategory, searchQuery, maxPrice, sortBy]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const toggleAccordion = (key: keyof typeof openAccordion) => {
    setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const toggleWishlist = (id: string, name: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(`Removed ${name} from your wishlist.`);
        return prev.filter((item) => item !== id);
      } else {
        showToast(`Added ${name} to your wishlist! ❤️`);
        return [...prev, id];
      }
    });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMaxPrice(10000);
    setSelectedFuel([]);
    setSelectedTransmission([]);
    setSelectedBrands([]);
    setBrandSearch("");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  // --- Dynamic Filtering Logic ---
  const filteredVehicles = useMemo(() => {
    return apiVehicles.filter((item) => {
      // Category filter (Category pill tabs or sidebar)
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }
      // Max price range
      if (item.pricePerDay > maxPrice) return false;
      // Fuel type
      if (selectedFuel.length > 0 && !selectedFuel.includes(item.fuelType)) return false;
      // Transmission
      if (
        selectedTransmission.length > 0 &&
        !selectedTransmission.includes(item.transmission)
      ) {
        return false;
      }
      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0; // "recommended" keeps original curated order
    });
  }, [
    apiVehicles,
    searchQuery,
    selectedCategory,
    maxPrice,
    selectedFuel,
    selectedTransmission,
    selectedBrands,
    sortBy,
  ]);

  // Pagination (9 items per page)
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE) || 1;
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVehicles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVehicles, currentPage]);

  // Dynamic Brand List based on current search filter inside brand accordion
  const allBrands = useMemo(() => {
    const brandsSet = Array.from(new Set(apiVehicles.map((v) => v.brand)));
    return brandsSet.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [apiVehicles, brandSearch]);

  // Dynamic Counts based on active fleet from DB
  const vehicleCounts = useMemo(() => {
    const dataset = apiVehicles;
    return {
      all: dataset.length,
      bike: dataset.filter((v) => v.category === "bike").length,
      scooter: dataset.filter((v) => v.category === "scooter").length,
      car: dataset.filter((v) => v.category === "car").length,
      petrol: dataset.filter((v) => v.fuelType === "Petrol").length,
      diesel: dataset.filter((v) => v.fuelType === "Diesel").length,
      electric: dataset.filter((v) => v.fuelType === "Electric").length,
      manual: dataset.filter((v) => v.transmission === "Manual").length,
      automatic: dataset.filter((v) => v.transmission === "Automatic").length,
    };
  }, [apiVehicles]);

  // Shared by the desktop sidebar and the mobile drawer so both expose the same filters
  const filterSections = (
    <>
      {/* Vehicle Type Filter */}
      <div className="border-b border-line pb-5">
        <button
          onClick={() => toggleAccordion("vehicleType")}
          className="flex w-full items-center justify-between text-sm font-bold text-ink"
        >
          <span>Vehicle Type</span>
          {openAccordion.vehicleType ? (
            <ChevronUp className="size-4 text-muted" />
          ) : (
            <ChevronDown className="size-4 text-muted" />
          )}
        </button>
        {openAccordion.vehicleType && (
          <div className="mt-3.5 space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium">
              <input
                type="checkbox"
                checked={selectedCategory === "all"}
                onChange={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="accent-brand size-4 rounded"
              />
              <span>All Vehicles ({vehicleCounts.all})</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium text-ink/80">
              <input
                type="checkbox"
                checked={selectedCategory === "bike"}
                onChange={() => {
                  setSelectedCategory(selectedCategory === "bike" ? "all" : "bike");
                  setCurrentPage(1);
                }}
                className="accent-brand size-4 rounded"
              />
              <span>Bikes ({vehicleCounts.bike})</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium text-ink/80">
              <input
                type="checkbox"
                checked={selectedCategory === "scooter"}
                onChange={() => {
                  setSelectedCategory(selectedCategory === "scooter" ? "all" : "scooter");
                  setCurrentPage(1);
                }}
                className="accent-brand size-4 rounded"
              />
              <span>Scooters ({vehicleCounts.scooter})</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium text-ink/80">
              <input
                type="checkbox"
                checked={selectedCategory === "car"}
                onChange={() => {
                  setSelectedCategory(selectedCategory === "car" ? "all" : "car");
                  setCurrentPage(1);
                }}
                className="accent-brand size-4 rounded"
              />
              <span>Cars ({vehicleCounts.car})</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Range Slider Filter */}
      <div className="border-b border-line pb-5">
        <button
          onClick={() => toggleAccordion("priceRange")}
          className="flex w-full items-center justify-between text-sm font-bold text-ink"
        >
          <span>Price Range <span className="text-muted text-xs font-normal">(per day)</span></span>
          {openAccordion.priceRange ? (
            <ChevronUp className="size-4 text-muted" />
          ) : (
            <ChevronDown className="size-4 text-muted" />
          )}
        </button>
        {openAccordion.priceRange && (
          <div className="mt-3.5 space-y-3">
            <input
              type="range"
              min="400"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-brand h-1.5 bg-gray-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-semibold text-muted">
              <span>₹ 0</span>
              <span className="text-brand font-bold">₹ {maxPrice.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Fuel Type Filter */}
      <div className="border-b border-line pb-5">
        <button
          onClick={() => toggleAccordion("fuelType")}
          className="flex w-full items-center justify-between text-sm font-bold text-ink"
        >
          <span>Fuel Type</span>
          {openAccordion.fuelType ? (
            <ChevronUp className="size-4 text-muted" />
          ) : (
            <ChevronDown className="size-4 text-muted" />
          )}
        </button>
        {openAccordion.fuelType && (
          <div className="mt-3.5 space-y-2.5 text-xs">
            {(["Petrol", "Diesel", "Electric"] as FuelType[]).map((fuel) => {
              const count =
                fuel === "Petrol"
                  ? vehicleCounts.petrol
                  : fuel === "Diesel"
                  ? vehicleCounts.diesel
                  : vehicleCounts.electric;
              const isChecked = selectedFuel.includes(fuel);
              return (
                <label key={fuel} className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium text-ink/80">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setSelectedFuel((prev) =>
                        isChecked ? prev.filter((f) => f !== fuel) : [...prev, fuel]
                      );
                      setCurrentPage(1);
                    }}
                    className="accent-brand size-4 rounded"
                  />
                  <span>{fuel} ({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Transmission Filter */}
      <div className="border-b border-line pb-5">
        <button
          onClick={() => toggleAccordion("transmission")}
          className="flex w-full items-center justify-between text-sm font-bold text-ink"
        >
          <span>Transmission</span>
          {openAccordion.transmission ? (
            <ChevronUp className="size-4 text-muted" />
          ) : (
            <ChevronDown className="size-4 text-muted" />
          )}
        </button>
        {openAccordion.transmission && (
          <div className="mt-3.5 space-y-2.5 text-xs">
            {(["Manual", "Automatic"] as TransmissionType[]).map((trans) => {
              const count =
                trans === "Manual" ? vehicleCounts.manual : vehicleCounts.automatic;
              const isChecked = selectedTransmission.includes(trans);
              return (
                <label key={trans} className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium text-ink/80">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      setSelectedTransmission((prev) =>
                        isChecked ? prev.filter((t) => t !== trans) : [...prev, trans]
                      );
                      setCurrentPage(1);
                    }}
                    className="accent-brand size-4 rounded"
                  />
                  <span>{trans} ({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div>
        <button
          onClick={() => toggleAccordion("brand")}
          className="flex w-full items-center justify-between text-sm font-bold text-ink"
        >
          <span>Brand</span>
          {openAccordion.brand ? (
            <ChevronUp className="size-4 text-muted" />
          ) : (
            <ChevronDown className="size-4 text-muted" />
          )}
        </button>
        {openAccordion.brand && (
          <div className="mt-3.5 space-y-3">
            {/* Brand search box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brand..."
                className="w-full rounded-lg border border-line bg-gray-50 py-2 pl-8 pr-3 text-xs text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              />
            </div>

            <div className="max-h-44 overflow-y-auto space-y-2 text-xs pr-1 scrollbar-thin">
              {allBrands.map((b) => {
                const count = apiVehicles.filter((v) => v.brand === b).length;
                const isChecked = selectedBrands.includes(b);
                return (
                  <label key={b} className="flex items-center gap-2.5 cursor-pointer hover:text-brand font-medium text-ink/80">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedBrands((prev) =>
                          isChecked ? prev.filter((brand) => brand !== b) : [...prev, b]
                        );
                        setCurrentPage(1);
                      }}
                      className="accent-brand size-4 rounded"
                    />
                    <span>{b} ({count})</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="bg-[#f8f9fa] text-ink min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 z-50 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <span className="flex-1">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} aria-label="Dismiss" className="text-white/60 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* --- HERO BANNER SECTION --- */}
      <section className="relative overflow-hidden bg-ink py-12 sm:py-16 lg:py-20">
        {/* Background Image with Dark Overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/images/photos/red-mountains.jpg"
            alt="Mountains banner background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/80 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="max-w-2xl space-y-3">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-brand bg-brand/10 px-3 py-1 rounded-full border border-brand/20">
                BIKE &bull; CAR &bull; RENTALS
              </span>
              <h1 className="text-[28px] min-[400px]:text-[32px] sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Find Your <br />
                <span className="text-brand">Perfect Ride</span>
              </h1>
              <p className="text-white/80 text-sm sm:text-lg max-w-xl font-normal leading-relaxed pt-1">
                Choose from a wide range of bikes, scooters and cars for every journey.
                Affordable. Flexible. Reliable.
              </p>
            </div>

            {/* Handwritten "Ride Explore Belong" Tagline */}
            <div className="hidden lg:block text-right pr-6">
              <p className="font-script text-5xl text-white/90 -rotate-6 select-none">
                Ride
                <br />
                <span className="text-brand ml-6">Explore</span>
                <br />
                <span className="ml-12 text-white">Belong</span>
              </p>
            </div>
          </div>

          {/* --- FLOATING SEARCH BAR CARD --- */}
          <div className="mt-8 sm:mt-10 max-w-4xl">
            <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-line flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-4 size-5 text-brand shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search for bikes, scooters or cars (e.g. Activa, KTM, Creta)"
                  className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="pr-3 text-muted hover:text-ink"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-dark"
              >
                Search Vehicles <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* --- CATEGORY TABS & SORT BAR --- */}
      <section className="bg-white border-b border-line sticky top-[76px] lg:top-[88px] z-30 shadow-xs">
        <Container className="py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
            {/* Category Pills: scroll sideways on narrow screens instead of overflowing the page */}
            <div className="-mx-5 flex min-w-0 items-center gap-2 overflow-x-auto px-5 scrollbar-none sm:mx-0 sm:px-0">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === "all"
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "bg-gray-100 text-ink/80 hover:bg-gray-200"
                }`}
              >
                <LayoutGrid className="size-4" />
                All Vehicles ({vehicleCounts.all})
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("bike");
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === "bike"
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "bg-gray-100 text-ink/80 hover:bg-gray-200"
                }`}
              >
                <Bike className="size-4" />
                Bikes ({vehicleCounts.bike})
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("scooter");
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === "scooter"
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "bg-gray-100 text-ink/80 hover:bg-gray-200"
                }`}
              >
                <ScooterIcon className="size-4" />
                Scooters ({vehicleCounts.scooter})
              </button>

              <button
                onClick={() => {
                  setSelectedCategory("car");
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === "car"
                    ? "bg-brand text-white shadow-md shadow-brand/20"
                    : "bg-gray-100 text-ink/80 hover:bg-gray-200"
                }`}
              >
                <Car className="size-4" />
                Cars ({vehicleCounts.car})
              </button>
            </div>

            {/* Counter info & Sort Dropdown */}
            <div className="flex flex-wrap items-center justify-between lg:justify-end gap-x-4 gap-y-2 text-xs">
              <span className="text-muted font-medium inline-flex items-center gap-1.5">
                <span className="hidden sm:inline">Showing </span>
                <strong className="text-ink font-bold">{filteredVehicles.length}</strong> vehicles
                <span className="hidden sm:inline"> in Bengaluru</span>
                <button
                  type="button"
                  onClick={fetchVehicles}
                  disabled={isLoadingVehicles}
                  title="Refresh live fleet from database"
                  className="ml-1 p-1 rounded-md text-muted hover:text-brand hover:bg-slate-100 transition"
                >
                  <RefreshCw className={`size-3.5 ${isLoadingVehicles ? "animate-spin text-brand" : ""}`} />
                </button>
              </span>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Drawer Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-line bg-white font-semibold text-ink"
                >
                  <SlidersHorizontal className="size-3.5 text-brand" />
                  Filters
                </button>

                {/* Sort By Dropdown */}
                <label className="flex items-center gap-2 shrink-0">
                  <span className="text-muted font-semibold hidden sm:inline">Sort By</span>
                  <span className="sr-only sm:hidden">Sort By</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="max-w-[150px] sm:max-w-none rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-brand focus:outline-none shadow-2xs"
                  >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* --- MAIN PAGE CONTENT: SIDEBAR + GRID --- */}
      <Container className="pt-6 sm:pt-8">
        <div className="grid lg:grid-cols-[250px_1fr] xl:grid-cols-[270px_1fr] gap-6 xl:gap-8 items-start">

          {/* ================= SIDEBAR FILTERS (DESKTOP) ================= */}
          <aside className="hidden lg:block lg:sticky lg:top-[168px] lg:max-h-[calc(100dvh-184px)] lg:overflow-y-auto scrollbar-thin bg-white rounded-2xl border border-line p-5 shadow-xs space-y-6">
            
            {filterSections}

            {/* Clear Filters Button */}
            <button
              onClick={clearAllFilters}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white py-2.5 text-xs font-semibold text-ink hover:bg-gray-100 hover:border-brand/40 transition"
            >
              <RotateCcw className="size-3.5 text-muted" />
              Clear Filters
            </button>
          </aside>

          {/* ================= VEHICLE CARDS GRID ================= */}
          <main className="space-y-6">
            {/* API Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-line/20 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    isLiveApi
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  <span
                    className={`size-2 rounded-full ${
                      isLiveApi ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    }`}
                  />
                  {isLiveApi
                    ? "Live API Connected (GET /api/v1/vehicles)"
                    : "RYPP Fleet (Local Cache)"}
                </span>
                <span className="text-xs text-muted">
                  Showing {filteredVehicles.length} vehicles
                </span>
              </div>
              <button
                type="button"
                onClick={() => fetchVehicles()}
                disabled={isLoadingVehicles}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-dark transition disabled:opacity-50"
              >
                <RefreshCw
                  className={`size-3.5 ${
                    isLoadingVehicles ? "animate-spin text-brand" : ""
                  }`}
                />
                Refresh from API
              </button>
            </div>

            {isLoadingVehicles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse rounded-2xl border border-line bg-white p-4 space-y-4"
                  >
                    <div className="aspect-[16/10] w-full rounded-xl bg-gray-200" />
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                    <div className="h-8 w-full rounded-xl bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : currentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {currentItems.map((vehicle) => {
                  const isWishlisted = wishlist.includes(vehicle.id);
                  const safeImage =
                    vehicle.image && typeof vehicle.image === "string" && vehicle.image.trim()
                      ? vehicle.image.trim()
                      : vehicle.category === "car"
                      ? "/images/photos/v-thar.jpg"
                      : vehicle.category === "scooter"
                      ? "/images/photos/v-activa.jpg"
                      : "/images/photos/v-himalayan.jpg";
                  return (
                    <div
                      key={vehicle.id}
                      className="group relative flex flex-col rounded-2xl border border-line bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
                    >
                      {/* Image Container with Wishlist Heart */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        <Link href={`/vehicles/${vehicle.id}`} className="block size-full">
                          <Image
                            src={safeImage}
                            alt={vehicle.name || "Vehicle"}
                            fill
                            sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(vehicle.id, vehicle.name)}
                          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 shadow-md backdrop-blur-xs transition hover:scale-110"
                          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart
                            className={`size-4 transition ${
                              isWishlisted ? "fill-brand text-brand" : "text-gray-500"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h3 className="font-bold text-ink text-[15px] sm:text-base line-clamp-1 group-hover:text-brand transition-colors">
                            <Link href={`/vehicles/${vehicle.id}`}>{vehicle.name}</Link>
                          </h3>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="flex items-center gap-1 text-amber-500 font-semibold">
                              <Star className="size-3.5 fill-amber-500 text-amber-500" />
                              <span>{vehicle.rating}</span>
                            </div>
                            <span className="text-muted">({vehicle.reviews} reviews)</span>
                          </div>

                          {/* Price */}
                          <div className="pt-2 flex items-baseline gap-1">
                            <span className="text-base sm:text-lg font-extrabold text-ink">
                              ₹ {vehicle.pricePerDay.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted font-medium">/ day</span>
                          </div>

                          {/* Specs Badges */}
                          <div className="flex flex-wrap gap-2 pt-2 text-[11px] font-medium text-muted">
                            <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-ink/80 border border-line/60">
                              <span className="text-emerald-600 font-bold">✓</span> {vehicle.transmission}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-ink/80 border border-line/60">
                              {vehicle.fuelType}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Link
                          href={`/vehicles/${vehicle.id}/book`}
                          // phones: soft tint so the CTA doesn't outweigh the photo/price; solid red from sm up
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blush py-2.5 text-xs font-semibold text-brand sm:transition sm:bg-brand sm:py-3 sm:text-white sm:shadow-md sm:hover:bg-brand-dark sm:hover:shadow-lg"
                        >
                          Book Now <ArrowRight className="size-3.5" />
                          <span className="sr-only"> {vehicle.name}</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="rounded-2xl border border-line bg-white p-8 sm:p-12 text-center space-y-4">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-gray-100 text-muted">
                  <Search className="size-8" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-ink">No vehicles matched your search</h3>
                <p className="text-xs text-muted max-w-md mx-auto">
                  Try adjusting your filter options, clearing the brand search, or lowering the price filter.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-brand-dark"
                >
                  <RotateCcw className="size-3.5" /> Clear All Filters
                </button>
              </div>
            )}

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink disabled:opacity-40 hover:bg-gray-100 transition"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`grid size-9 place-items-center rounded-full text-xs font-bold transition ${
                      currentPage === pageNum
                        ? "bg-brand text-white shadow-md shadow-brand/30"
                        : "border border-line bg-white text-ink hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="grid size-9 place-items-center rounded-full border border-line bg-white text-ink disabled:opacity-40 hover:bg-gray-100 transition"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </main>
        </div>

        {/* --- WEEKLY OFFER PROMO BANNER --- */}
        <div className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl bg-ink p-6 sm:p-8 lg:p-12 shadow-xl border border-line">
          <Image
            src="/images/photos/red-mountains.jpg"
            alt="Banner backdrop"
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-transparent" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_auto] items-center gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand">
                PLAN MORE, SPEND LESS.
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">
                Get Up to 20% Off on Weekly Bookings!
              </h2>
              <p className="text-xs sm:text-sm text-white/70">
                More destinations. Greater freedom with RYPP.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <p className="hidden md:block font-script text-3xl text-white/80 -rotate-3 select-none">
                Ride Explore Belong
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-xs font-semibold text-white shadow-lg sm:transition sm:hover:bg-brand-dark"
              >
                Book Now <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* --- TRUST FEATURES ROW --- */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6 pt-6 border-t border-line text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">Verified Vehicles</h4>
              <p className="text-[11px] text-muted">Safe & reliable rides</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
              <Tag className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">Transparent Pricing</h4>
              <p className="text-[11px] text-muted">No hidden charges</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
              <Calendar className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">Flexible Rentals</h4>
              <p className="text-[11px] text-muted">Daily, Weekly, Monthly</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
              <Headphones className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">24/7 Support</h4>
              <p className="text-[11px] text-muted">We&apos;re always here</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 col-span-2 sm:col-span-1">
            <div className="grid size-10 place-items-center rounded-full bg-brand/10 text-brand shrink-0">
              <Star className="size-5 fill-brand text-brand" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ink">Trusted by 50K+</h4>
              <p className="text-[11px] text-muted">Happy Customers</p>
            </div>
          </div>
        </div>
      </Container>

      {/* --- MOBILE FILTER DRAWER SHEET --- */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter vehicles"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white h-dvh shadow-2xl flex flex-col"
          >
            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <h3 className="font-bold text-ink text-base">Filter Vehicles</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="rounded-full p-1 text-muted hover:bg-gray-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              {filterSections}
            </div>

            <div className="p-5 pt-4 border-t border-line space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-brand py-3 text-xs font-semibold text-white shadow-md"
              >
                Show {filteredVehicles.length} Vehicles
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFiltersOpen(false);
                }}
                className="w-full rounded-xl border border-line py-2.5 text-xs font-semibold text-ink"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
