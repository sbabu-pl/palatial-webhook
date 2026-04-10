import Link from "next/link";
import LeadForm from "../../components/LeadForm";

export default function EducationPage() {
  const pillars = [
    {
      title: "Guaranteed School Fees",
      desc: "Ensure your child's education continues uninterrupted at every level, from primary to university.",
      icon: "🎓"
    },
    {
      title: "Savings with a Bonus",
      desc: "Earn competitive returns and bonuses on your premiums, building a substantial fund for higher education.",
      icon: "💰"
    },
    {
      title: "Waiver of Premium",
      desc: "In the event of a tragedy, the insurance company takes over the payments, ensuring the goal is still met.",
      icon: "🛡️"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-primary text-white py-24 px-6 lg:px-12 relative overflow-hidden">
        {/* Decorative circle representing a bright future */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-growth-emerald/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 leading-tight">
              Secure Their <br />
              <span className="text-growth-emerald">Academic Dreams.</span>
            </h1>
            <p className="text-blue-100 text-xl leading-relaxed">
              Don't leave your child's future to chance. Our education policies provide a disciplined way to save for school fees while offering life-cover protection for the parent.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Why Education Cover */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-8 underline decoration-growth-emerald decoration-4 underline-offset-8">
                Investing in Excellence
              </h2>
              <div className="space-y-10">
                {pillars.map((pillar, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="bg-gray-50 p-4 rounded-2xl h-fit border border-gray-100 group-hover:bg-growth-emerald/5 group-hover:border-growth-emerald/20 transition duration-300">
                      <span className="text-3xl">{pillar.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-primary mb-2">{pillar.title}</h4>
                      <p className="text-charcoal/70 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Fact Card */}
            <div className="bg-growth-emerald/5 border border-growth-emerald/20 p-8 rounded-3xl">
              <h4 className="font-bold text-growth-emerald mb-2 italic">Did you know?</h4>
              <p className="text-charcoal/80 text-sm leading-relaxed">
                Education inflation in Kenya typically outpaces general inflation. Starting an education policy early allows you to leverage compound interest to meet rising university costs.
              </p>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-gray-200 shadow-2xl sticky top-28">
            <div className="mb-8">
              <div className="h-1 w-12 bg-growth-emerald mb-4 rounded-full"></div>
              <h3 className="text-3xl font-bold text-primary">Start Saving Today</h3>
              <p className="text-charcoal/60 mt-2">Tell us your goal and we will show you the best education plans in Kenya.</p>
            </div>
            
            <LeadForm />
            
            <div className="mt-8 flex items-center justify-center gap-6 grayscale opacity-30">
                <span className="font-black text-lg italic">OLD MUTUAL</span>
                <span className="font-black text-lg italic">ICEA LION</span>
                <span className="font-black text-lg italic">BRITAM</span>
                <span className="font-black text-lg italic">CIC</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}