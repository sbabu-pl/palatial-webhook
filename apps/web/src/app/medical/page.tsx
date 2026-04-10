import Link from "next/link";
import LeadForm from "../../components/LeadForm";

export default function MedicalPage() {
  const benefits = [
    { title: "Inpatient Cover", desc: "Comprehensive hospital stay coverage, including surgery and theater fees." },
    { title: "Outpatient & Dental", desc: "Routine checkups, specialized consultations, and dental/optical add-ons." },
    { title: "Maternity Benefits", desc: "Support for delivery costs and pre/post-natal care for the growing family." },
    { title: "Chronic Care", desc: "Management of pre-existing and chronic conditions with top-tier underwriters." }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-primary text-white py-24 px-6 lg:px-12 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-growth-emerald/5 -skew-x-12 transform translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Health Insurance <br />
              <span className="text-growth-emerald">That Cares.</span>
            </h1>
            <p className="text-blue-100 text-xl leading-relaxed">
              Protect your family’s future with comprehensive medical covers from Jubilee, Britam, CIC, and more. Quality healthcare shouldn't be a luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits & Form Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Detailed Benefits */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-10">Total Family Protection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className="w-10 h-1 bg-growth-emerald mb-4 rounded-full"></div>
                  <h4 className="font-bold text-primary mb-2">{item.title}</h4>
                  <p className="text-charcoal/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span>🛡️</span> Corporate & SME Plans
              </h4>
              <p className="text-charcoal/70 text-sm mb-6 leading-relaxed">
                Looking to insure your employees? We offer specialized group schemes for businesses of all sizes, from startups to large corporations.
              </p>
              <Link href="/contact" className="text-primary font-bold text-sm border-b border-primary hover:text-growth-emerald hover:border-growth-emerald transition">
                Request a Corporate Quote →
              </Link>
            </div>
          </div>

          {/* Right Column: The Form */}
          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-200 shadow-2xl sticky top-28">
             <div className="mb-8">
              <h3 className="text-3xl font-bold text-primary">Get a Health Quote</h3>
              <p className="text-charcoal/60 mt-2">Compare inpatient and outpatient plans across the market.</p>
            </div>
            
            {/* The lead form for data collection */}
            <LeadForm />

            <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                <span className="text-xs font-bold text-primary italic">JUBILEE</span>
                <span className="text-xs font-bold text-primary italic">BRITAM</span>
                <span className="text-xs font-bold text-primary italic">CIC</span>
                <span className="text-xs font-bold text-primary italic">MADISON</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}