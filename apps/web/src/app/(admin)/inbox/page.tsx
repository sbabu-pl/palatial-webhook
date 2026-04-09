import { getLeadsFromCoreApi } from "../../../lib/server/palatial-api";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const response = await getLeadsFromCoreApi();
  const leads = response?.data?.items || [];

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-slate-100">
      <div className="mx-auto max-w-5xl">
        
        {/* TOP NAVIGATION BAR */}
        <div className="mb-8 flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">PALATIAL Agency Command</h1>
            <div className="mt-2 flex gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
              <a href="/inbox" className="text-blue-500 hover:text-white transition-colors">● Inbox</a>
              <a href="/survey" className="hover:text-white transition-colors">○ Survey</a>
              <a href="https://business.facebook.com/latest/inbox/" target="_blank" className="hover:text-white transition-colors">○ WhatsApp Admin Portal</a>
            </div>
          </div>
          <div className="text-right">
            <span className="rounded-full bg-blue-600 px-4 py-1 text-[10px] font-black uppercase text-white shadow-lg shadow-blue-900/40">
              {leads.length} LIVE LEADS
            </span>
          </div>
        </div>

        {/* DATA GRID */}
        {leads.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-800 p-20 text-center">
            <p className="text-slate-500 italic">No incoming leads detected.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-1">
            {leads.map((lead: any) => (
              <div key={lead.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-[#1e293b] p-5 shadow-2xl transition-all hover:border-blue-500/50">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded bg-blue-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                    {lead.productType || "INQUIRY"}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(lead.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{lead.fullName}</h3>
                    <p className="font-mono text-sm text-blue-400">{lead.phone}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-bold hover:bg-slate-700 transition-all border border-slate-700">
                      View Details
                    </button>
                  </div>
                </div>

                {lead.notes && (
                  <div className="mt-4 rounded-lg bg-black/30 p-3 border-l-2 border-blue-500">
                    <p className="text-xs italic text-slate-400">{lead.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}