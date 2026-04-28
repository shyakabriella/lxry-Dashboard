import { useMemo, useState } from "react";
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
} from "lucide-react";

const bookings = [
  {
    id: 1,
    guestName: "Jean Claude",
    email: "jean@example.com",
    phone: "+250 788 000 111",
    service: "Accommodation",
    date: "2026-04-28",
    time: "14:00",
    guests: 2,
    status: "confirmed",
    note: "King room booking request",
  },
  {
    id: 2,
    guestName: "Aline Mukamana",
    email: "aline@example.com",
    phone: "+250 788 000 222",
    service: "Wedding",
    date: "2026-04-30",
    time: "10:00",
    guests: 80,
    status: "pending",
    note: "Wedding hall inquiry",
  },
  {
    id: 3,
    guestName: "Patrick Niyonsenga",
    email: "patrick@example.com",
    phone: "+250 788 000 333",
    service: "Restaurant & Bar",
    date: "2026-05-01",
    time: "19:30",
    guests: 4,
    status: "cancelled",
    note: "Dinner table reservation",
  },
  {
    id: 4,
    guestName: "Grace Uwase",
    email: "grace@example.com",
    phone: "+250 788 000 444",
    service: "Massage & Spa",
    date: "2026-05-02",
    time: "11:00",
    guests: 1,
    status: "confirmed",
    note: "Full body massage booking",
  },
];

const statusStyles = {
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  pending: {
    label: "Pending",
    icon: AlertCircle,
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-50 text-red-700 ring-red-200",
  },
};

export default function Booking() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        booking.guestName.toLowerCase().includes(keyword) ||
        booking.email.toLowerCase().includes(keyword) ||
        booking.phone.toLowerCase().includes(keyword) ||
        booking.service.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  ).length;

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
              Booking Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              View and manage all customer booking requests for accommodation,
              wedding, restaurant, and massage services.
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/10">
            <p className="text-xs font-medium text-slate-300">Today</p>
            <p className="mt-1 text-xl font-bold text-white">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={CalendarCheck}
          description="All booking requests"
        />

        <StatCard
          title="Confirmed"
          value={confirmedBookings}
          icon={CheckCircle2}
          description="Approved bookings"
        />

        <StatCard
          title="Pending"
          value={pendingBookings}
          icon={AlertCircle}
          description="Waiting for review"
        />

        <StatCard
          title="Cancelled"
          value={cancelledBookings}
          icon={XCircle}
          description="Cancelled requests"
        />
      </div>

      {/* Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by guest, email, phone, or service..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <Filter size={17} className="text-slate-400" />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-slate-900">
            Booking Requests
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
                <TableHead>Guest</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <BookingRow key={booking.id} booking={booking} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center">
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

function BookingRow({ booking }) {
  const status = statusStyles[booking.status] || statusStyles.pending;
  const StatusIcon = status.icon;

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="whitespace-nowrap px-5 py-4">
        <div>
          <p className="text-sm font-bold text-slate-900">
            {booking.guestName}
          </p>

          <div className="mt-1 flex flex-col gap-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail size={13} />
              {booking.email}
            </span>

            <span className="flex items-center gap-1.5">
              <Phone size={13} />
              {booking.phone}
            </span>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <p className="text-sm font-bold text-slate-800">{booking.service}</p>
        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
          {booking.note}
        </p>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="text-sm font-semibold text-slate-800">
          {booking.date}
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={13} />
          {booking.time}
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Users size={16} className="text-slate-400" />
          {booking.guests}
        </div>
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
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-600"
        >
          <Eye size={15} />
          View
        </button>
      </td>
    </tr>
  );
}