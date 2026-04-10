import Link from "next/link";
import LeadForm from "../components/LeadForm"; // Adjust path if necessary

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="bg-primary text-white pt-20 pb-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Smart Insurance <br />
              <span className="text-palace-gold font-medium italic">for Your Peace of Mind.</span>
            </h1>
            <p className="text-lg text-blue-100 mb-10 max-w-lg">
              Compare quotes from Kenya's top underwriters, manage claims, and get 24/7 support—all powered by our intelligent WhatsApp assistant.
            </p>
            <div className="flex flex-wrap gap-4">
                <Link 
                href="/motor"
                className="bg-growth-emerald hover:bg-[#0da472] text-white px-8 py-4 rounded-xl font-extrabold text-lg transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:scale-95 text-center"
                >
                Get an Instant Quote
                </Link>
              <a a href="https://wa.me/254733606608" className="border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition">
                Chat on WhatsApp
              </a>
            </div>
          </div>
          {/* AI Assistant Card */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-palace-gold/30 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4 text-palace-gold">Try our AI Assistant</h3>
              <p className="text-blue-100 mb-6">Scan or click to get a motor or medical quote in under 2 minutes.</p>
              <a
                href="https://wa.me/254733606608"
                className="block bg-white text-primary text-center py-4 rounded-2xl font-extrabold hover:bg-palace-gold hover:text-white transition duration-300"
                >
                    WhatsApp: 0733 606 608
                </a>
              </div>
            </div>
      </section>

      {/* 2. PRODUCT GRID SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coverage Tailored For You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We partner with leading underwriters like Jubilee, Britam, and CIC to bring you the best rates in Kenya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Card 1 */}
            <Link href="/motor" className="bg-primary p-8 rounded-xl shadow-sm hover:shadow-xl transition border border-gray-100 group">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                🚗
              </div>
              <h3 className="text-xl font-bold text-white -900 mb-2">Motor Insurance</h3>
              <p className="text-white -600 text-sm">Comprehensive and Third-Party covers for your personal or commercial vehicles.</p>
            </Link>

            {/* Product Card 2 */}
            <Link href="/medical" className="bg-primary p-8 rounded-xl shadow-sm hover:shadow-xl transition border border-gray-100 group">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition">
                🏥
              </div>
              <h3 className="text-xl font-bold text-white -900 mb-2">Medical Cover</h3>
              <p className="text-white -600 text-sm">Inpatient and outpatient covers to protect your family's health and finances.</p>
            </Link>

            {/* Product Card 3 */}
            <Link href="/home" className="bg-primary p-8 rounded-xl shadow-sm hover:shadow-xl transition border border-gray-100 group">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-600 group-hover:text-white transition">
                🏠
              </div>
              <h3 className="text-xl font-bold text-white -900 mb-2">Home Insurance</h3>
              <p className="text-white -600 text-sm">Protect your building, contents, and domestic workers against domestic risks.</p>
            </Link>

            {/* Product Card 4 */}
            <Link href="/business" className="bg-primary p-8 rounded-xl shadow-sm hover:shadow-xl transition border border-gray-100 group">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition">
                💼
              </div>
              <h3 className="text-xl font-bold text-white -900 mb-2">Business Cover</h3>
              <p className="text-white -600 text-sm">WIBA, Fire, Burglary, and professional indemnity for your growing business.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE US (TRUST SECTION) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Unbiased Advice</h4>
            <p className="text-gray-600">As an agency, we don't work for the insurance company. We work for you, ensuring you get the best market rates.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">24/7 Digital Support</h4>
            <p className="text-gray-600">Our intelligent WhatsApp bot allows you to get quotes, renew policies, and ask questions anytime, anywhere.</p>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-3">Claims Advocacy</h4>
            <p className="text-gray-600">When an accident happens, we step in. We guide you through the process and fight for your fast settlement.</p>
          </div>
        </div>
      </section>

      {/* 4. THE CONVERSION SECTION (LEAD CAPTURE) */}
      <section id="quote-section" className="py-20 px-6 bg-blue-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to secure your future? Let's get started.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Fill out the form with your details, and our system will match you with the best underwriter. You'll receive a quote via WhatsApp and email shortly.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✔</span> No hidden broker fees.
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✔</span> Licensed by the Insurance Regulatory Authority (IRA).
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-3">✔</span> Digital policy documents sent instantly.
              </li>
            </ul>
          </div>

          {/* Embed the Form Component we built earlier */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 transform translate-x-4 translate-y-4 rounded-xl -z-10"></div>
            <LeadForm defaultProduct="GENERAL" />
          </div>
        </div>
      </section>

    </div>
  );
}