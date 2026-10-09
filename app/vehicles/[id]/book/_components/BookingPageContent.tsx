"use client";

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleCheck,
  ClipboardList,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Fuel,
  Gauge,
  Headset,
  IdCard,
  Info,
  Landmark,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  Settings,
  ShieldCheck,
  Smartphone,
  Star,
  Tag,
  Trash2,
  Upload,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { Container } from "../../../../_components/ui";
import { SERVICE_FEE, TIME_SLOTS, type VehicleDetail } from "../../../../_lib/vehiclesData";

// ---------------------------------------------------------------------------
// Types, constants & helpers
// ---------------------------------------------------------------------------

type Trip = { pickupDate: string; pickupTime: string; dropDate: string; dropTime: string };
type Stage = "details" | "payment" | "confirmed";
type Doc = { file: File; url: string } | null;
type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";
type FieldKey = "trip" | "name" | "mobile" | "email" | "city" | "idDoc" | "dlDoc" | "terms";

const ID_TYPES = ["Aadhaar Card", "PAN Card", "Passport", "Voter ID"];
const MAX_DOC_BYTES = 5 * 1024 * 1024;
const DOC_ACCEPT = ".pdf,.jpg,.jpeg,.png";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; hint: string; icon: typeof Smartphone }[] = [
  { id: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm, etc.", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", hint: "All major Indian banks", icon: Landmark },
  { id: "wallet", label: "Wallet", hint: "Paytm, Amazon Pay, etc.", icon: Wallet },
];

const STEPS = [
  { label: "Booking Details", short: "Booking" },
  { label: "Your Details", short: "Details" },
  { label: "Payment", short: "Payment" },
  { label: "Confirmation", short: "Done" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const inr = new Intl.NumberFormat("en-IN");

/** "2026-09-15" -> "15 Sep 2026" (string maths, so no timezone drift) */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function toDateTime(iso: string, time: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time);
  if (!y || !m || !d || !match) return null;
  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return new Date(y, m - 1, d, h, Number(match[2]));
}

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// shared field styling
const inputBase =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] text-ink placeholder:text-muted/70 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15 sm:text-sm";
const inputClass = (invalid?: boolean) => `${inputBase} ${invalid ? "border-brand" : "border-line"}`;

// ---------------------------------------------------------------------------
// Small presentational pieces
// ---------------------------------------------------------------------------

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-4 shadow-[0_8px_24px_-20px_rgba(11,17,25,0.35)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

function CardHeader({
  icon: Icon,
  title,
  subtitle,
  aside,
}: {
  icon: typeof Info;
  title: ReactNode;
  subtitle?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <Icon className="mt-0.5 size-6 shrink-0 text-ink sm:size-7" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold leading-tight text-ink sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[12px] text-muted sm:text-[13px]">{subtitle}</p>}
      </div>
      {aside}
    </div>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div id={`field-${id}`}>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-semibold text-ink sm:text-[13px]">
        {label}
        {required && <span className="ml-0.5 text-brand">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] font-medium text-brand">{error}</p>}
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-1 items-start" aria-label="Booking progress">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={step.label} className="relative flex flex-1 flex-col items-center text-center">
            {/* connector to the next step */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-1/2 top-4 h-px w-full sm:top-5 ${done ? "bg-brand" : "bg-line"}`}
              />
            )}
            <span
              aria-current={active ? "step" : undefined}
              className={`relative z-10 grid size-8 place-items-center rounded-full border-2 text-[13px] font-bold sm:size-10 sm:text-sm ${
                done
                  ? "border-brand bg-brand text-white"
                  : active
                    ? "border-brand bg-brand text-white shadow-[0_0_0_5px_rgba(228,32,44,0.12)]"
                    : "border-line bg-white text-ink"
              }`}
            >
              {done ? <Check className="size-4" aria-hidden /> : i + 1}
            </span>
            <span
              className={`mt-1.5 text-[11px] leading-tight sm:mt-2 sm:text-[13px] ${
                active ? "font-semibold text-brand" : done ? "font-medium text-ink" : "text-muted"
              }`}
            >
              <span className="sm:hidden">{step.short}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function DocUpload({
  inputId,
  step,
  title,
  tone,
  doc,
  error,
  onFile,
  onRemove,
  children,
}: {
  inputId: string;
  step: number;
  title: string;
  tone: "red" | "blue";
  doc: Doc;
  error?: string;
  onFile: (file: File) => void;
  onRemove: () => void;
  children?: ReactNode;
}) {
  const panel = tone === "red" ? "border-red-100 bg-red-50/40" : "border-sky-100 bg-sky-50/50";
  const badge = tone === "red" ? "bg-brand" : "bg-sky-600";

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
    e.target.value = ""; // allow re-selecting the same file after removing it
  }

  return (
    <div className={`flex flex-col rounded-xl border p-3.5 sm:p-4 ${panel}`}>
      <div className="flex items-center gap-2.5">
        <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[12px] font-bold text-white ${badge}`}>
          {step}
        </span>
        <h3 className="text-[13px] font-bold text-ink sm:text-sm">
          {title} <span className="text-brand">*</span>
        </h3>
      </div>

      {children}

      <div className="mt-3 flex-1">
        {doc ? (
          <div className="rounded-lg border border-emerald-200 bg-white p-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-muted">
                <FileText className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-ink sm:text-[13px]">{doc.file.name}</p>
                <p className="text-[11px] text-muted">{formatBytes(doc.file.size)}</p>
              </div>
              <CircleCheck className="size-6 shrink-0 fill-emerald-500 text-white" aria-label="Uploaded" />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/70 pt-2.5 text-[12px] font-semibold">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sky-700 hover:underline">
                <Eye className="size-3.5" aria-hidden /> View Document
              </a>
              <div className="flex items-center gap-3">
                <label htmlFor={inputId} className="cursor-pointer text-ink/70 hover:text-ink">
                  Replace
                </label>
                <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 text-muted hover:text-brand">
                  <Trash2 className="size-3.5" aria-hidden /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed bg-white/70 px-3 py-5 text-center transition hover:border-brand/50 hover:bg-white ${
              error ? "border-brand/60" : "border-line"
            }`}
          >
            <Upload className="size-5 text-brand" aria-hidden />
            <span className="text-[12px] font-semibold text-ink sm:text-[13px]">Click to upload</span>
            <span className="text-[11px] text-muted">PDF, JPG or PNG · max 5 MB</span>
          </label>
        )}
        <input id={inputId} type="file" accept={DOC_ACCEPT} className="sr-only" onChange={handleChange} />
        {error && <p className="mt-1.5 text-[11px] font-medium text-brand">{error}</p>}
      </div>
    </div>
  );
}

function PaymentOptions({
  method,
  onChange,
  name,
}: {
  method: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  name: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Payment method</legend>
      {PAYMENT_METHODS.map(({ id, label, hint, icon: Icon }) => {
        const checked = method === id;
        return (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition sm:px-3.5 ${
              checked ? "border-brand bg-red-50/40" : "border-line hover:border-brand/40"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={id}
              checked={checked}
              onChange={() => onChange(id)}
              className="size-4 shrink-0 accent-brand"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-ink">{label}</span>
              <span className="block truncate text-[11px] text-muted">{hint}</span>
            </span>
            <Icon className={`size-5 shrink-0 ${checked ? "text-brand" : "text-muted"}`} aria-hidden />
          </label>
        );
      })}
    </fieldset>
  );
}

function SummaryRow({ icon: Icon, label, value }: { icon: typeof Info; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 text-[13px]">
      <Icon className="size-4 shrink-0 text-brand" aria-hidden />
      <span className="w-16 shrink-0 font-semibold text-ink sm:w-20">{label}</span>
      <span className="ml-auto text-right text-ink/80">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function BookingPageContent({
  vehicle,
  today,
  initialTrip,
}: {
  vehicle: VehicleDetail;
  today: string;
  initialTrip: Trip;
}) {
  const [stage, setStage] = useState<Stage>("details");

  // trip
  const [trip, setTrip] = useState<Trip>(initialTrip);
  const updateTrip = (patch: Partial<Trip>) => setTrip((t) => ({ ...t, ...patch }));

  // renter
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Bengaluru");

  // documents
  const [idType, setIdType] = useState(ID_TYPES[0]);
  const [idDoc, setIdDoc] = useState<Doc>(null);
  const [dlDoc, setDlDoc] = useState<Doc>(null);
  const [docErrors, setDocErrors] = useState<{ idDoc?: string; dlDoc?: string }>({});

  // extras
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [helmet, setHelmet] = useState(false);
  const [delivery, setDelivery] = useState(false);

  // payment
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [paying, setPaying] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const [showErrors, setShowErrors] = useState(false);

  // object URLs back the "View Document" links; revoke whatever is still alive on unmount
  const docsRef = useRef({ idDoc, dlDoc });
  useEffect(() => {
    docsRef.current = { idDoc, dlDoc };
  }, [idDoc, dlDoc]);
  useEffect(
    () => () => {
      if (docsRef.current.idDoc) URL.revokeObjectURL(docsRef.current.idDoc.url);
      if (docsRef.current.dlDoc) URL.revokeObjectURL(docsRef.current.dlDoc.url);
    },
    []
  );

  function setDocument(key: "idDoc" | "dlDoc", file: File | null) {
    const setter = key === "idDoc" ? setIdDoc : setDlDoc;
    if (file) {
      const okType = /\.(pdf|jpe?g|png)$/i.test(file.name);
      if (!okType || file.size > MAX_DOC_BYTES) {
        setDocErrors((e) => ({ ...e, [key]: !okType ? "Upload a PDF, JPG or PNG file." : "File is larger than 5 MB." }));
        return;
      }
    }
    setDocErrors((e) => ({ ...e, [key]: undefined }));
    setter((prev) => {
      if (prev) URL.revokeObjectURL(prev.url);
      return file ? { file, url: URL.createObjectURL(file) } : null;
    });
  }

  // --- derived trip + pricing ---
  const start = toDateTime(trip.pickupDate, trip.pickupTime);
  const end = toDateTime(trip.dropDate, trip.dropTime);
  const hours = start && end ? Math.round((end.getTime() - start.getTime()) / 3_600_000) : 0;
  const days = Math.max(1, Math.ceil(hours / 24));
  const durationText = `${days} Day${days > 1 ? "s" : ""} (${Math.max(hours, 0)} Hours)`;
  const subtotal = vehicle.pricePerDay * days;
  const total = subtotal + SERVICE_FEE;
  const isTwoWheeler = vehicle.category !== "car";
  const paymentLabel = PAYMENT_METHODS.find((m) => m.id === payment)?.label ?? "";

  // --- validation ---
  const errors: Partial<Record<FieldKey, string>> = {};
  if (!start || !end || hours <= 0) errors.trip = "Drop must be after pickup.";
  else if (trip.pickupDate < today) errors.trip = "Pickup date can't be in the past.";
  if (!name.trim()) errors.name = "Enter your full name.";
  if (!/^[6-9]\d{9}$/.test(mobile)) errors.mobile = "Enter a valid 10-digit mobile number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address.";
  if (!city.trim()) errors.city = "Enter your city.";
  if (!idDoc) errors.idDoc = docErrors.idDoc ?? "Upload your government ID.";
  if (!dlDoc) errors.dlDoc = docErrors.dlDoc ?? "Upload your driving licence.";
  if (!agreed) errors.terms = "Please accept the terms to continue.";
  const err = (k: FieldKey) => (showErrors || (k === "idDoc" || k === "dlDoc" ? docErrors[k] : false) ? errors[k] : undefined);

  function goTo(next: Stage) {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function proceedToPayment() {
    const firstError = (Object.keys(errors) as FieldKey[])[0];
    if (firstError) {
      setShowErrors(true);
      document.getElementById(`field-${firstError}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    goTo("payment");
  }

  function pay() {
    setPaying(true);
    // stand-in for a payment gateway round trip
    setTimeout(() => {
      setBookingRef(`RYPP-${Math.floor(100000 + Math.random() * 900000)}`);
      setPaying(false);
      goTo("confirmed");
    }, 1200);
  }

  const currentStep = stage === "details" ? 0 : stage === "payment" ? 2 : STEPS.length;
  const categoryLabel = vehicle.category === "bike" ? "Bikes" : vehicle.category === "scooter" ? "Scooters" : "Cars";

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-14 text-ink sm:pb-16">
      {/* --- BREADCRUMBS --- */}
      <div className="border-b border-line bg-white py-3 text-[11px] sm:text-xs">
        <Container>
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-muted">
            <Link href="/" className="transition hover:text-brand">Home</Link>
            <span aria-hidden>&gt;</span>
            <Link href="/vehicles" className="transition hover:text-brand">Vehicles</Link>
            <span aria-hidden>&gt;</span>
            <Link href="/vehicles" className="transition hover:text-brand">{categoryLabel}</Link>
            <span aria-hidden>&gt;</span>
            <Link href={`/vehicles/${vehicle.id}`} className="min-w-0 truncate transition hover:text-brand">
              {vehicle.name}
            </Link>
            <span aria-hidden>&gt;</span>
            <span className="font-semibold text-ink">Book Now</span>
          </nav>
        </Container>
      </div>

      <Container className="pt-5 sm:pt-8">
        {/* --- STEPPER + SECURE BADGE --- */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Stepper current={currentStep} />
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <ShieldCheck className="size-9 text-ink" strokeWidth={1.5} aria-hidden />
            <div className="leading-tight">
              <p className="text-[13px] font-bold text-ink">Secure Booking</p>
              <p className="text-[11px] text-muted">Your information is safe with us</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-5 sm:mt-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          {/* ================= MAIN COLUMN ================= */}
          <div className="min-w-0 space-y-5">
            {stage === "details" && (
              <>
                {/* --- TRIP DETAILS --- */}
                <Card>
                  <CardHeader icon={CalendarDays} title="Trip Details" subtitle="Choose your rental period" />
                  <div id="field-trip" className="mt-5 grid gap-4 md:grid-cols-2">
                    {(
                      [
                        { key: "pickup", label: "Pickup Date & Time", date: "pickupDate", time: "pickupTime", min: today },
                        { key: "drop", label: "Drop Date & Time", date: "dropDate", time: "dropTime", min: trip.pickupDate },
                      ] as const
                    ).map((row) => (
                      <fieldset key={row.key}>
                        <legend className="mb-1.5 text-[12px] font-semibold text-ink sm:text-[13px]">
                          {row.label} <span className="text-brand">*</span>
                        </legend>
                        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] gap-2">
                          <div className="relative">
                            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand" aria-hidden />
                            <input
                              type="date"
                              aria-label={`${row.label.split(" ")[0]} date`}
                              value={trip[row.date]}
                              min={row.min}
                              onChange={(e) => updateTrip({ [row.date]: e.target.value })}
                              className={`${inputClass(!!err("trip"))} pl-9 pr-2`}
                            />
                          </div>
                          <div className="relative">
                            <Clock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                            <select
                              aria-label={`${row.label.split(" ")[0]} time`}
                              value={trip[row.time]}
                              onChange={(e) => updateTrip({ [row.time]: e.target.value })}
                              className={`${inputClass(!!err("trip"))} pl-9 pr-2`}
                            >
                              {TIME_SLOTS.map((t) => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </fieldset>
                    ))}
                  </div>
                  {err("trip") && <p className="mt-2 text-[11px] font-medium text-brand">{err("trip")}</p>}

                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-sky-50 px-4 py-3">
                    <Clock className="size-6 shrink-0 text-ink sm:size-7" strokeWidth={1.75} aria-hidden />
                    <div className="leading-snug">
                      <p className="text-[13px] font-semibold text-ink sm:text-sm">
                        Rental Duration: {hours > 0 ? durationText : "—"}
                      </p>
                      <p className="text-[11px] text-muted sm:text-[12px]">
                        You can extend your booking later from &ldquo;My Bookings&rdquo;.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* --- YOUR DETAILS --- */}
                <Card>
                  <CardHeader icon={UserRound} title="Your Details" subtitle="Enter your information to proceed" />
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <Field id="name" label="Full Name" required error={err("name")}>
                      <input
                        id="name"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className={inputClass(!!err("name"))}
                      />
                    </Field>
                    <Field id="mobile" label="Mobile Number" required error={err("mobile")}>
                      <div className={`flex overflow-hidden rounded-lg border bg-white focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15 ${err("mobile") ? "border-brand" : "border-line"}`}>
                        <span className="flex items-center border-r border-line bg-slate-50 px-3 text-[13px] font-medium text-ink sm:text-sm">
                          +91
                        </span>
                        <input
                          id="mobile"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="98765 43210"
                          className="min-w-0 flex-1 px-3.5 py-2.5 text-[13px] text-ink placeholder:text-muted/70 focus:outline-none sm:text-sm"
                        />
                      </div>
                    </Field>
                    <Field id="email" label="Email Address" required error={err("email")}>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={inputClass(!!err("email"))}
                      />
                    </Field>
                    <Field id="city" label="City" required error={err("city")}>
                      <input
                        id="city"
                        autoComplete="address-level2"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputClass(!!err("city"))}
                      />
                    </Field>
                  </div>
                </Card>

                {/* --- DOCUMENTS --- */}
                <Card>
                  <CardHeader
                    icon={IdCard}
                    title={
                      <>
                        ID Proof &amp; Driving Licence <span className="text-brand">(Mandatory)</span>
                      </>
                    }
                    subtitle="Both documents are required for booking"
                  />
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div id="field-idDoc" className="flex">
                      <DocUpload
                        inputId="id-doc"
                        step={1}
                        title="Government ID Proof"
                        tone="red"
                        doc={idDoc}
                        error={err("idDoc")}
                        onFile={(f) => setDocument("idDoc", f)}
                        onRemove={() => setDocument("idDoc", null)}
                      >
                        <label htmlFor="id-type" className="sr-only">ID type</label>
                        <select
                          id="id-type"
                          value={idType}
                          onChange={(e) => setIdType(e.target.value)}
                          className={`${inputClass()} mt-3 py-2`}
                        >
                          {ID_TYPES.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </DocUpload>
                    </div>
                    <div id="field-dlDoc" className="flex">
                      <DocUpload
                        inputId="dl-doc"
                        step={2}
                        title="Driving Licence"
                        tone="blue"
                        doc={dlDoc}
                        error={err("dlDoc")}
                        onFile={(f) => setDocument("dlDoc", f)}
                        onRemove={() => setDocument("dlDoc", null)}
                      />
                    </div>
                  </div>

                  {idDoc && dlDoc && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                      <ShieldCheck className="size-7 shrink-0 fill-emerald-500 text-white" aria-hidden />
                      <div className="leading-snug">
                        <p className="text-[13px] font-semibold text-emerald-800">Both documents uploaded</p>
                        <p className="text-[11px] text-emerald-900/70 sm:text-[12px]">
                          We&apos;ll verify them before your pickup. You can proceed with your booking.
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* --- ADDITIONAL INFORMATION --- */}
                <Card>
                  <CardHeader
                    icon={Info}
                    title={
                      <>
                        Additional Information <span className="text-[13px] font-normal text-muted sm:text-base">(Optional)</span>
                      </>
                    }
                    subtitle="Help us serve you better"
                  />
                  <div className="mt-5">
                    <label htmlFor="notes" className="mb-1.5 block text-[12px] font-semibold text-ink sm:text-[13px]">
                      Special Requests
                    </label>
                    <textarea
                      id="notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requests? (e.g. extra helmet, pickup instructions)"
                      className={`${inputClass()} resize-y`}
                    />
                  </div>
                </Card>

                {/* --- SECURITY + CONSENT + ACTIONS --- */}
                <Card>
                  <div className="rounded-xl bg-red-50/50 p-4 sm:p-5">
                    <CardHeader icon={ShieldCheck} title="Security & Verification" />
                    <ul className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-red-100">
                      {[
                        { icon: BadgeCheck, title: "Identity Verification", text: "Your documents are verified and secure." },
                        { icon: Lock, title: "Secure Payments", text: "All transactions are encrypted and processed securely." },
                        { icon: Users, title: "Safe & Trusted Rentals", text: "We verify every customer for a better and safer experience." },
                      ].map(({ icon: Icon, title, text }) => (
                        <li key={title} className="flex items-start gap-3 sm:flex-col sm:items-center sm:px-4 sm:text-center">
                          <Icon className="size-6 shrink-0 text-brand" aria-hidden />
                          <div>
                            <p className="text-[13px] font-bold text-ink">{title}</p>
                            <p className="mt-0.5 text-[11px] leading-snug text-muted sm:text-[12px]">{text}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 space-y-3 text-[12px] text-ink/80 sm:text-[13px]">
                    <div id="field-terms">
                      <label className="flex cursor-pointer items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 size-4 shrink-0 accent-brand"
                        />
                        <span>
                          I agree to the{" "}
                          <Link href="/#contact" className="font-medium text-brand underline">Terms &amp; Conditions</Link> and{" "}
                          <Link href="/#contact" className="font-medium text-brand underline">Privacy Policy</Link>.{" "}
                          <span className="text-brand">*</span>
                        </span>
                      </label>
                      {err("terms") && <p className="ml-6.5 mt-1 text-[11px] font-medium text-brand">{err("terms")}</p>}
                    </div>
                    {isTwoWheeler && (
                      <label className="flex cursor-pointer items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={helmet}
                          onChange={(e) => setHelmet(e.target.checked)}
                          className="mt-0.5 size-4 shrink-0 accent-brand"
                        />
                        <span>I want a helmet (Free)</span>
                      </label>
                    )}
                    <label className="flex cursor-pointer items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={delivery}
                        onChange={(e) => setDelivery(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-brand"
                      />
                      <span>
                        I want {vehicle.category === "car" ? "the car" : "the vehicle"} delivered to my location (additional charges may apply)
                      </span>
                    </label>
                  </div>

                  {/* total is in the sidebar on desktop; repeat it here on phones where the sidebar is far below */}
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 lg:hidden">
                    <span className="text-[13px] font-semibold text-ink">Total Amount</span>
                    <span className="text-lg font-extrabold text-ink">₹ {inr.format(total)}</span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[13px] font-semibold text-ink transition hover:bg-slate-50 sm:px-6 sm:text-sm"
                    >
                      <ArrowLeft className="size-4" aria-hidden /> Back
                    </Link>
                    <button
                      type="button"
                      onClick={proceedToPayment}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark sm:ml-auto sm:max-w-[260px] sm:text-sm"
                    >
                      Proceed to Payment <ArrowRight className="size-4" aria-hidden />
                    </button>
                  </div>
                </Card>
              </>
            )}

            {stage === "payment" && (
              <Card>
                <CardHeader icon={ClipboardList} title="Review & Pay" subtitle="Check your booking before paying" />

                <dl className="mt-5 divide-y divide-line rounded-xl border border-line text-[13px]">
                  {[
                    { k: "Renter", v: `${name.trim()} · +91 ${mobile}` },
                    { k: "Email", v: email.trim() },
                    { k: "Pickup", v: `${formatDate(trip.pickupDate)}, ${trip.pickupTime}` },
                    { k: "Drop", v: `${formatDate(trip.dropDate)}, ${trip.dropTime}` },
                    { k: "Documents", v: `${idType} + Driving Licence` },
                    {
                      k: "Add-ons",
                      v: [helmet && "Helmet", delivery && "Doorstep delivery"].filter(Boolean).join(", ") || "None",
                    },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-muted">{k}</dt>
                      <dd className="min-w-0 break-words font-medium text-ink sm:text-right">{v}</dd>
                    </div>
                  ))}
                </dl>

                {/* the sidebar's payment card sits below the fold on phones, so offer the choice inline */}
                <div className="mt-5 lg:hidden">
                  <p className="mb-2 text-[13px] font-semibold text-ink">Payment Method</p>
                  <PaymentOptions method={payment} onChange={setPayment} name="payment-inline" />
                </div>

                <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-[13px] font-semibold text-ink">
                    Total <span className="font-normal text-muted">via {paymentLabel}</span>
                  </span>
                  <span className="text-lg font-extrabold text-ink sm:text-xl">₹ {inr.format(total)}</span>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => goTo("details")}
                    disabled={paying}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-[13px] font-semibold text-ink transition hover:bg-slate-50 disabled:opacity-50 sm:px-6 sm:text-sm"
                  >
                    <ArrowLeft className="size-4" aria-hidden /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={pay}
                    disabled={paying}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-[13px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(228,32,44,0.7)] transition hover:bg-brand-dark disabled:opacity-70 sm:ml-auto sm:max-w-[260px] sm:text-sm"
                  >
                    {paying ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" aria-hidden /> Processing…
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" aria-hidden /> Pay ₹ {inr.format(total)}
                      </>
                    )}
                  </button>
                </div>
              </Card>
            )}

            {stage === "confirmed" && (
              <Card className="text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-600 sm:size-16">
                  <CircleCheck className="size-8 sm:size-10" aria-hidden />
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-ink sm:text-2xl">Booking Confirmed!</h2>
                <p className="mx-auto mt-1.5 max-w-md text-[13px] text-muted sm:text-sm">
                  Your {vehicle.name} is reserved. A confirmation has been sent to{" "}
                  <span className="font-semibold text-ink">{email.trim()}</span>.
                </p>

                <div className="mx-auto mt-5 max-w-md space-y-2 rounded-xl border border-line bg-slate-50 p-4 text-left text-[13px]">
                  <div className="flex justify-between gap-3 border-b border-line pb-2">
                    <span className="text-muted">Booking Reference</span>
                    <span className="font-mono font-bold text-brand">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted">Pickup</span>
                    <span className="text-right font-medium">{formatDate(trip.pickupDate)}, {trip.pickupTime}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-muted">Drop</span>
                    <span className="text-right font-medium">{formatDate(trip.dropDate)}, {trip.dropTime}</span>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-line pt-2 font-bold">
                    <span>Amount Paid</span>
                    <span>₹ {inr.format(total)}</span>
                  </div>
                </div>

                <p className="mx-auto mt-4 max-w-md text-[12px] text-muted">
                  Please carry your original {idType} and Driving Licence at pickup.
                </p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/vehicles"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-brand-dark sm:text-sm"
                  >
                    Browse More Vehicles <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-xl border border-line bg-white px-6 py-3 text-[13px] font-semibold text-ink transition hover:bg-slate-50 sm:text-sm"
                  >
                    Back to Home
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* ================= SIDEBAR ================= */}
          <aside className="min-w-0 space-y-5">
            {/* --- BOOKING SUMMARY --- */}
            <Card>
              <CardHeader icon={ClipboardList} title="Booking Summary" subtitle="Review your booking details" />

              <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 340px, 100vw"
                  className="object-cover"
                />
              </div>

              <h3 className="mt-3 text-base font-bold text-ink sm:text-lg">{vehicle.name}</h3>
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[12px]">
                  <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                  <span className="font-bold text-ink">{vehicle.rating}</span>
                  <span className="text-muted">({vehicle.reviews} reviews)</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <CircleCheck className="size-3.5" aria-hidden /> Verified Vehicle
                </span>
              </div>

              <ul className="mt-4 grid grid-cols-4 divide-x divide-line rounded-xl border border-line py-3 text-center">
                {[
                  { icon: Gauge, value: vehicle.engineCapacity.replace(/ (Turbo|i-VTEC|Battery)$/, ""), label: vehicle.fuelType === "Electric" ? "Battery" : "Engine" },
                  { icon: Fuel, value: vehicle.fuelType, label: "Fuel" },
                  { icon: Settings, value: vehicle.transmission, label: "Gearbox" },
                  { icon: Users, value: vehicle.seatingCapacity.replace(" Seater", ""), label: "Seater" },
                ].map(({ icon: Icon, value, label }) => (
                  <li key={label} className="min-w-0 px-1">
                    <Icon className="mx-auto size-5 text-ink" strokeWidth={1.75} aria-hidden />
                    <p className="mt-1 truncate text-[11px] font-bold text-ink sm:text-[12px]">{value}</p>
                    <p className="text-[10px] text-muted sm:text-[11px]">{label}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2.5 border-b border-line pb-4">
                <SummaryRow icon={CalendarDays} label="Pickup" value={`${formatDate(trip.pickupDate)}, ${trip.pickupTime}`} />
                <SummaryRow icon={CalendarDays} label="Drop" value={`${formatDate(trip.dropDate)}, ${trip.dropTime}`} />
                <SummaryRow icon={Clock} label="Duration" value={hours > 0 ? durationText : "—"} />
              </div>

              <div className="space-y-2 pt-4 text-[13px] text-ink/80">
                <div className="flex justify-between gap-3">
                  <span>₹ {inr.format(vehicle.pricePerDay)} × {days} Day{days > 1 ? "s" : ""}</span>
                  <span>₹ {inr.format(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Service Fee</span>
                  <span>₹ {inr.format(SERVICE_FEE)}</span>
                </div>
                {helmet && (
                  <div className="flex justify-between gap-3">
                    <span>Helmet</span>
                    <span className="font-medium text-emerald-700">Free</span>
                  </div>
                )}
                {delivery && (
                  <div className="flex justify-between gap-3">
                    <span>Doorstep Delivery</span>
                    <span className="text-muted">Confirmed on call</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2.5">
                <span className="text-sm font-bold text-ink sm:text-base">Total Amount</span>
                <span className="text-lg font-extrabold text-ink sm:text-xl">₹ {inr.format(total)}</span>
              </div>
              <p className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-medium text-emerald-800">
                <Tag className="size-4 shrink-0" aria-hidden /> Free cancellation up to 24 hours before pickup.
              </p>
            </Card>

            {/* --- PAYMENT METHOD (not needed once paid) --- */}
            {stage !== "confirmed" && (
              <Card className={stage === "payment" ? "hidden lg:block" : ""}>
                <CardHeader
                  icon={Wallet}
                  title={
                    <>
                      Payment Method <span className="text-[13px] font-normal text-muted">(Secure Payment)</span>
                    </>
                  }
                  subtitle="Choose your preferred payment method"
                />
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
                  <ShieldCheck className="size-6 shrink-0 fill-emerald-500 text-white" aria-hidden />
                  <div className="leading-snug">
                    <p className="text-[12px] font-semibold text-emerald-800 sm:text-[13px]">Your payments are 100% secure</p>
                    <p className="text-[11px] text-emerald-900/70">
                      We use industry-standard encryption and trusted payment partners.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <PaymentOptions method={payment} onChange={setPayment} name="payment" />
                </div>
                <ul className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4 text-center text-[10px] leading-tight text-muted sm:text-[11px]">
                  <li className="flex flex-col items-center gap-1">
                    <Lock className="size-4 text-ink" aria-hidden /> 256-bit SSL encryption
                  </li>
                  <li className="flex flex-col items-center gap-1">
                    <ShieldCheck className="size-4 text-ink" aria-hidden /> PCI-DSS compliant
                  </li>
                  <li className="flex flex-col items-center gap-1">
                    <CreditCard className="size-4 text-ink" aria-hidden /> No card details stored
                  </li>
                </ul>
              </Card>
            )}

            {/* --- NEED HELP --- */}
            <Card className="bg-red-50/40">
              <CardHeader icon={Headset} title="Need Help?" subtitle="Our support team is here for you 24/7" />
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40"
                >
                  <Phone className="size-4 text-brand" aria-hidden /> +91 98765 43210
                </a>
                <a
                  href="mailto:hello@rypp.in"
                  className="flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 py-2.5 text-[13px] font-semibold text-ink transition hover:border-brand/40"
                >
                  <Mail className="size-4 text-brand" aria-hidden /> hello@rypp.in
                </a>
              </div>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  );
}
