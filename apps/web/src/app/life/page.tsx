import Link from "next/link";
import LeadForm from "../../components/LeadForm";

export default function LifeInsurancePage() {
  const features = [
    {
      title: "Term Life Assurance",
      desc: "Affordable protection for a specific period, ensuring your family is covered during critical years.",
      icon: "⏳"
    },
    {
      title: "Whole Life Plan",
      desc: "Lifetime coverage that builds a cash value over time, acting as both protection and a long-term asset.",
      icon: "🏦"
    },
    {
      title: "Last Expense Cover",
      desc: "Immediate financial support for funeral and transition costs, easing the burden on your family.",
      icon: "🕊️"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-primary text-white py-24 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-palace-gold/5 -skew-x-12 transform translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              A Legacy That <br />
              <span className="text-palace-gold">Endures.</span>
            </h1>
            <p className="text-blue-100 text-xl leading-relaxed">
              Life insurance isn't just about the end; it's about the security you provide for those who stay. We help you choose a plan that secures your family's future, no matter what.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Life Features */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8 underline decoration-palace-gold decoration-4 underline-offset-8">
                Protecting What Matters
              </h2>
              <div className="space-y-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100 transition hover:border-palace-gold/30">
                    <div className="text-3xl">{feature.icon}</div>
                    <div>
                      <h4 className="font-bold text-xl text-primary mb-1">{feature.title}</h4>
                      <p className="text-charcoal/70 text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote/Testimonial Trust Element */}
            <div className="p-8 bg-primary text-white rounded-[2rem] shadow-xl relative">
              <span className="absolute top-4 right-8 text-6xl text-white/10 italic">"</span>
              <p className="italic text-blue-100 mb-4 relative z-10">
                "The best time to buy life insurance was yesterday. The second best time is today. It’s the ultimate gift of love for your family."
              </p>
              <p className="font-bold text-palace-gold text-sm uppercase tracking-widest">— Palatial Wisdom</p>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-200 shadow-2xl sticky top-28">
            <div className="mb-8">
              <div className="h-1 w-12 bg-palace-gold mb-4 rounded-full"></div>
              <h3 className="text-3xl font-bold text-primary">Request Life Cover</h3>
              <p className="text-charcoal/60 mt-2">Get a confidential consultation and quote from our specialists.</p>
            </div>
            
            <LeadForm />
            
            <div className="mt-8 flex items-center justify-center gap-6 grayscale opacity-30">
                <span className="font-black text-lg">LIBERTY</span>
                <span className="font-black text-lg">OLD MUTUAL</span>
                <span className="font-black text-lg">BRITAM</span>
                <span className="font-black text-lg">ICEA LION</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}