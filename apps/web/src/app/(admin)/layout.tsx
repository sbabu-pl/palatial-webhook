import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      {/* 1. SIDEBAR */}
      <aside className="w-72 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col">
        <div className="p-8">
          <h2 className="text-xl font-bold tracking-tighter text-blue-500">PALATIAL CRM</h2>
          <p className="text-xs text-slate-500 uppercase mt-1 font-semibold tracking-widest">Agency Command</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition group">
            <span className="text-slate-400 group-hover:text-white">📊 Dashboard</span>
          </Link>
          <Link href="/inbox" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold">
            <span className="text-white">💬 Inbox</span>
          </Link>
          <Link href="/survey" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition group">
            <span className="text-slate-400 group-hover:text-white">📝 Survey</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs">B</div>
            <div>
              <p className="text-sm font-bold leading-none">Babu S.</p>
              <p className="text-xs text-slate-500 mt-1">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-100">Inbox</span>
          </div>
          <button className="bg-slate-800 p-2 rounded-full hover:bg-slate-700 transition">
            🔔
          </button>
        </header>

        {/* Page Content */}
        <main className="p-10 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}