import { Heart } from "lucide-react";

export default function Wedding() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Wedding</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage wedding venue and services information
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
            <Heart size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Wedding Services</h3>
            <p className="text-sm text-slate-500">Wedding packages and venue details</p>
          </div>
        </div>
        <p className="text-sm text-slate-600">
          Wedding management features will appear here.
        </p>
      </div>
    </div>
  );
}
