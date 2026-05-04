import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Trash2,
  CreditCard,
  UtensilsCrossed,
  ShoppingBag,
  X,
  BadgeDollarSign,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const statusStyles = {
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

const paymentStyles = {
  unpaid: {
    label: "Unpaid",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("authToken")
  );
}

function formatMoney(value) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value) {
  if (!value) return "Not set";

  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return value;
  }
}

function formatTime(value) {
  if (!value) return "Not set";

  return String(value).slice(0, 5);
}

function normalizeBookingType(type) {
  if (type === "buy_now") return "Buy Now";
  if (type === "table") return "Table";
  return type || "N/A";
}

function normalizePaymentMethod(method) {
  if (method === "counter") return "Pay at Counter";
  if (method === "room") return "Charge to Room";
  if (method === "card") return "Card";
  return method || "N/A";
}

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [bookingTypeFilter, setBookingTypeFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const params = new URLSearchParams();

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (paymentFilter !== "all") {
        params.append("payment_status", paymentFilter);
      }

      if (bookingTypeFilter !== "all") {
        params.append("booking_type", bookingTypeFilter);
      }

      const url = `${API_BASE_URL}/restaurant-bookings${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to fetch restaurant bookings."
        );
      }

      setBookings(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError(err.message || "Something went wrong while loading bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter, bookingTypeFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) return bookings;

    return bookings.filter((booking) => {
      const searchableText = [
        booking.booking_code,
        booking.customer_name,
        booking.email,
        booking.phone,
        booking.booking_type,
        booking.payment_method,
        booking.status,
        booking.payment_status,
        booking.custom_dish,
        booking.notes,
        ...(booking.items || []).map((item) => item.item_name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [bookings, searchTerm]);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

  const updateBooking = async (bookingId, payload) => {
    try {
      setActionLoadingId(bookingId);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/restaurant-bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update booking.");
      }

      const updatedBooking = result?.data;

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId ? updatedBooking || booking : booking
        )
      );

      setSelectedBooking((previous) =>
        previous?.id === bookingId ? updatedBooking || previous : previous
      );
    } catch (err) {
      console.error("Update booking error:", err);
      setError(err.message || "Something went wrong while updating booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(bookingId);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("You are not logged in. Please login again.");
      }

      const response = await fetch(`${API_BASE_URL}/restaurant-bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to delete booking.");
      }

      setBookings((previous) =>
        previous.filter((booking) => booking.id !== bookingId)
      );

      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error("Delete booking error:", err);
      setError(err.message || "Something went wrong while deleting booking.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-900 p-6 text-white shadow-xl shadow-slate-200">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 ring-1 ring-amber-300/20">
              <CalendarCheck size={24} />
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Restaurant Booking Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              View and manage restaurant table bookings and buy-now food orders
              from your backend API.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-lg transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total"
          value={totalBookings}
          icon={CalendarCheck}
          description="All requests"
        />

        <StatCard
          title="Pending"
          value={pendingBookings}
          icon={AlertCircle}
          description="Waiting review"
        />

        <StatCard
          title="Confirmed"
          value={confirmedBookings}
          icon={CheckCircle2}
          description="Approved"
        />

        <StatCard
          title="Completed"
          value={completedBookings}
          icon={CheckCircle2}
          description="Finished"
        />

        <StatCard
          title="Cancelled"
          value={cancelledBookings}
          icon={XCircle}
          description="Cancelled"
        />
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-center">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by customer, phone, email, code, item, note..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <FilterSelect
            icon={Filter}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              ["all", "All Status"],
              ["pending", "Pending"],
              ["confirmed", "Confirmed"],
              ["completed", "Completed"],
              ["cancelled", "Cancelled"],
            ]}
          />

          <FilterSelect
            icon={BadgeDollarSign}
            value={paymentFilter}
            onChange={setPaymentFilter}
            options={[
              ["all", "All Payments"],
              ["unpaid", "Unpaid"],
              ["paid", "Paid"],
              ["failed", "Failed"],
            ]}
          />

          <FilterSelect
            icon={UtensilsCrossed}
            value={bookingTypeFilter}
            onChange={setBookingTypeFilter}
            options={[
              ["all", "All Types"],
              ["table", "Table"],
              ["buy_now", "Buy Now"],
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">
            Restaurant Bookings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {filteredBookings.length} booking result
            {filteredBookings.length !== 1 ? "s" : ""} found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      Loading bookings...
                    </p>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    actionLoadingId={actionLoadingId}
                    deletingId={deletingId}
                    onView={() => setSelectedBooking(booking)}
                    onUpdate={updateBooking}
                    onDelete={deleteBooking}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <CalendarCheck size={26} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-slate-900">
                      No bookings found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking ? (
        <BookingModal
          booking={selectedBooking}
          actionLoadingId={actionLoadingId}
          deletingId={deletingId}
          onClose={() => setSelectedBooking(null)}
          onUpdate={updateBooking}
          onDelete={deleteBooking}
        />
      ) : null}
    </div>
  );
}

function FilterSelect({ icon: Icon, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <Icon size={17} className="text-slate-400" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
      >
        {options.map(([optionValue, label]) => (
          <option key={optionValue} value={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <Icon size={22} />
        </div>

        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>

      <h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs font-medium text-slate-500">{description}</p>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-5 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
      {children}
    </th>
  );
}

function BookingRow({
  booking,
  actionLoadingId,
  deletingId,
  onView,
  onUpdate,
  onDelete,
}) {
  const status = statusStyles[booking.status] || statusStyles.pending;
  const payment = paymentStyles[booking.payment_status] || paymentStyles.unpaid;
  const StatusIcon = status.icon;

  const isUpdating = actionLoadingId === booking.id;
  const isDeleting = deletingId === booking.id;

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="whitespace-nowrap px-5 py-4">
        <div>
          <p className="text-sm font-bold text-slate-900">
            {booking.customer_name || "Unknown Customer"}
          </p>

          <p className="mt-0.5 text-xs font-semibold text-amber-700">
            {booking.booking_code || `Booking #${booking.id}`}
          </p>

          <div className="mt-1 flex flex-col gap-1 text-xs text-slate-500">
            {booking.email ? (
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {booking.email}
              </span>
            ) : null}

            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              {booking.phone || "No phone"}
            </span>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-2">
          {booking.booking_type === "buy_now" ? (
            <ShoppingBag size={16} className="text-amber-600" />
          ) : (
            <UtensilsCrossed size={16} className="text-amber-600" />
          )}

          <div>
            <p className="text-sm font-bold text-slate-800">
              {normalizeBookingType(booking.booking_type)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {normalizePaymentMethod(booking.payment_method)}
            </p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="text-sm font-semibold text-slate-800">
          {formatDate(booking.booking_date)}
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={13} />
          {formatTime(booking.booking_time)}
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Users size={16} className="text-slate-400" />
          {booking.party_size || 1}
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <p className="text-sm font-black text-slate-900">
          {formatMoney(booking.total)}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {booking.items?.length || 0} item
          {(booking.items?.length || 0) !== 1 ? "s" : ""}
        </p>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ${status.className}`}
        >
          <StatusIcon size={14} />
          {status.label}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1 ${payment.className}`}
        >
          <CreditCard size={14} />
          {payment.label}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
          >
            <Eye size={15} />
            View
          </button>

          <select
            value={booking.status || "pending"}
            disabled={isUpdating}
            onChange={(event) =>
              onUpdate(booking.id, { status: event.target.value })
            }
            className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-slate-700 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:opacity-60"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            type="button"
            onClick={() => onDelete(booking.id)}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            title="Delete booking"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

function BookingModal({
  booking,
  actionLoadingId,
  deletingId,
  onClose,
  onUpdate,
  onDelete,
}) {
  const isUpdating = actionLoadingId === booking.id;
  const isDeleting = deletingId === booking.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Booking Details
            </h3>

            <p className="text-sm font-semibold text-amber-700">
              {booking.booking_code || `Booking #${booking.id}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <DetailCard title="Customer Information">
              <DetailRow label="Name" value={booking.customer_name} />
              <DetailRow label="Phone" value={booking.phone} />
              <DetailRow label="Email" value={booking.email || "Not provided"} />
            </DetailCard>

            <DetailCard title="Booking Information">
              <DetailRow
                label="Type"
                value={normalizeBookingType(booking.booking_type)}
              />
              <DetailRow
                label="Payment Method"
                value={normalizePaymentMethod(booking.payment_method)}
              />
              <DetailRow label="Date" value={formatDate(booking.booking_date)} />
              <DetailRow label="Time" value={formatTime(booking.booking_time)} />
              <DetailRow label="Party Size" value={booking.party_size || 1} />
            </DetailCard>

            <DetailCard title="Payment Summary">
              <DetailRow label="Subtotal" value={formatMoney(booking.subtotal)} />
              <DetailRow label="Total" value={formatMoney(booking.total)} />
              <DetailRow
                label="Payment Status"
                value={paymentStyles[booking.payment_status]?.label || "Unpaid"}
              />
            </DetailCard>

            <DetailCard title="Notes">
              <DetailRow
                label="Custom Dish"
                value={booking.custom_dish || "No custom dish"}
              />
              <DetailRow label="Notes" value={booking.notes || "No notes"} />
            </DetailCard>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <h4 className="text-sm font-black text-slate-900">
                Ordered Items
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {booking.items?.length ? (
                booking.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-[1fr_auto_auto_auto]"
                  >
                    <p className="font-bold text-slate-900">
                      {item.item_name || "Item"}
                    </p>

                    <p className="text-slate-600">Qty: {item.quantity}</p>

                    <p className="text-slate-600">
                      Price: {formatMoney(item.unit_price)}
                    </p>

                    <p className="font-black text-slate-900">
                      {formatMoney(item.total_price)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  No items found for this booking.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={booking.status || "pending"}
              disabled={isUpdating}
              onChange={(event) =>
                onUpdate(booking.id, { status: event.target.value })
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-60"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={booking.payment_status || "unpaid"}
              disabled={isUpdating}
              onChange={(event) =>
                onUpdate(booking.id, {
                  payment_status: event.target.value,
                })
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:opacity-60"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onDelete(booking.id)}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            Delete Booking
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <h4 className="mb-3 text-sm font-black text-slate-900">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-bold text-slate-900">
        {value || "N/A"}
      </span>
    </div>
  );
}