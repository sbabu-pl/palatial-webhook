import LeadForm from "../../components/LeadForm";

export default function MotorPage() {
  return (
    <div className="bg-white">
      {/* Mini Hero */}
      <section className="bg-primary text-white py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Motor Insurance <span className="text-palace-gold">Simplified.</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            From Comprehensive to Third Party, get the best rates from Kenya's leading underwriters in minutes. 
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Benefits & Trust */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Why Insure with Palatial?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-growth-emerald/10 p-3 rounded-lg h-fit">
                    <span className="text-growth-emerald text-xl font-bold">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-primary">Instant Comparative Quotes</h4>
                    <p className="text-charcoal/70 text-sm">We don't just give you one price. we show you the best options from 10+ partners.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-growth-emerald/10 p-3 rounded-lg h-fit">
                    <span className="text-growth-emerald text-xl font-bold">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-primary">24/7 Accident Support</h4>
                    <p className="text-charcoal/70 text-sm">Involved in a fender bender? Chat with our AI bot immediately for help with police abstracts and towing.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-growth-emerald/10 p-3 rounded-lg h-fit">
                    <span className="text-growth-emerald text-xl font-bold">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-primary">Agreed Value Policies</h4>
                    <p className="text-charcoal/70 text-sm">We ensure your vehicle is valued correctly so you never lose out during a claim.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Logos Placeholder */}
            <div className="pt-8 border-t border-gray-100">
              <p className="text-xs font-bold text-charcoal/40 uppercase tracking-widest mb-4">Our Underwriting Partners</p>
              <div className="flex flex-wrap gap-4 opacity-50 grayscale hover:grayscale-0 transition">
                {/* You can add partner logo images here later */}
                <span className="font-bold text-xl">JUBILEE</span>
                <span className="font-bold text-xl">SANLAM-ALLIANZ</span>
                <span className="font-bold text-xl">PIONEER</span>
                <span className="font-bold text-xl">AAR</span>
                <span className="font-bold text-xl">CIC</span>
                <span className="font-bold text-xl">GA</span>
              </div>
            </div>
          </div>

          {/* Right Side: The Lead Form Card */}
          <div className="bg-gray-50 p-8 lg:p-10 rounded-3xl border border-gray-100 shadow-xl sticky top-24">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-primary">Get Your Quote</h3>
              <p className="text-charcoal/60 text-sm">Tell us about your vehicle and we'll handle the rest.</p>
            </div>
            
            {/* The form we built earlier */}
            <LeadForm defaultProduct="MOTOR" />
            
            <p className="mt-6 text-[10px] text-center text-charcoal/40 uppercase tracking-tight leading-relaxed">
              By submitting, you agree to our privacy policy and consent to being contacted by Palatial Insurance Agency.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}