import Link from "next/link";

export default function ClaimsPage() {
  const claimSteps = [
    {
      title: "Ensure Safety",
      desc: "Switch on hazard lights. Check for injuries and call 999 or 112 if medical help is needed.",
      icon: "🚨"
    },
    {
      title: "Document the Scene",
      desc: "Take clear photos of vehicle damage, license plates, and the surrounding area.",
      icon: "📸"
    },
    {
      title: "Obtain Police Abstract",
      desc: "Report the incident to the nearest police station to get an official abstract.",
      icon: "📝"
    },
    {
      title: "Notify Palatial",
      desc: "Message our WhatsApp bot or call us immediately to initiate the claim process.",
      icon: "📱"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-primary text-white py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-6">
            Claims <span className="text-palace-gold">Advocacy.</span>
          </h1>
          <p className="text-blue-100 text-xl max-w-3xl mx-auto leading-relaxed">
            When the unexpected happens, we step in. Our team guides you through the entire process to ensure a fair and fast settlement.
          </p>
        </div>
      </section>

      {/* Emergency Steps Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">What to do in an accident</h2>
          <div className="h-1 w-20 bg-palace-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {claimSteps.map((step, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition duration-300 group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
              <h4 className="text-xl font-bold text-primary mb-3">{step.title}</h4>
              <p className="text-charcoal/70 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Downloads Section */}
      <section className="bg-gray-900 text-white py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-palace-gold">Download Claim Forms</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Need to file a formal report? Download the standard claim forms below. Once filled, scan and send them to <span className="text-white font-medium underline">claims@palatial.co.ke</span>
              </p>
              
              <div className="space-y-4">
                <a href="#" className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition group">
                  <div className="flex items-center gap-4">
                    <span className="text-red-400 text-2xl">📄</span>
                    <span className="font-bold">Motor Claim Form (General)</span>
                  </div>
                  <span className="text-palace-gold group-hover:translate-x-1 transition-transform">Download →</span>
                </a>
                <a href="#" className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-5 rounded-2xl border border-white/10 transition group">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400 text-2xl">📄</span>
                    <span className="font-bold">Medical Claim Form</span>
                  </div>
                  <span className="text-palace-gold group-hover:translate-x-1 transition-transform">Download →</span>
                </a>
              </div>
            </div>

            <div className="bg-primary p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-white">Need Immediate Help?</h3>
              <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                Our AI-powered WhatsApp assistant can help you start your claim notification in under 60 seconds.
              </p>
              <a 
                href="https://wa.me/254733606608?text=I%20need%20to%20report%20a%20claim"
                className="block w-full py-4 bg-growth-emerald text-white text-center rounded-xl font-extrabold hover:bg-emerald-600 transition shadow-lg"
              >
                Report via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}