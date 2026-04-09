export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Agency Overview</h1>
        <p className="text-slate-400 mt-2">Welcome back. Here is what is happening today.</p>
      </header>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Total Leads</p>
          <h3 className="text-5xl font-black mt-2">142</h3>
          <p className="text-green-500 text-sm mt-2 font-bold">+12% from yesterday</p>
        </div>
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Policies Active</p>
          <h3 className="text-5xl font-black mt-2">86</h3>
          <p className="text-blue-500 text-sm mt-2 font-bold">4 Pending Renewal</p>
        </div>
        <div className="p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Conversion Rate</p>
          <h3 className="text-5xl font-black mt-2">24%</h3>
          <p className="text-slate-400 text-sm mt-2">Target: 30%</p>
        </div>
      </div>
    </div>
  );
}