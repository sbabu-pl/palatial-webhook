import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="inline-block">
            <Image 
              src="/logo-icon.png" 
              alt="Palatial Icon" 
              width={280} 
              height={118} 
              className="h-18 md:h-20 w-auto"
            />
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Smart, fast, and reliable insurance coverage. We compare the market so you don't have to.
          </p>
          <div className="bg-gray-800 inline-block px-3 py-1 rounded text-xs font-semibold text-gray-300 border border-gray-700">
            Regulated by the IRA Kenya
          </div>
        </div>

        {/* Products Column */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Products</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/motor" className="hover:text-white transition">Motor Insurance</Link></li>
            <li><Link href="/motor" className="hover:text-white transition">Life Insurance</Link></li>
            <li><Link href="/motor" className="hover:text-white transition">Education Cover</Link></li>
            <li><Link href="/medical" className="hover:text-white transition">Medical Cover</Link></li>
            <li><Link href="/home" className="hover:text-white transition">Home Insurance</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/claims" className="hover:text-white transition">Claims Support</Link></li>
            <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">📍</span>
              <span>Nairobi, Kenya</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">📞</span>
              <span>+254 733 606 608</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">✉️</span>
              <span>info@palatial.co.ke</span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Palatial Insurance Agency. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Powered by AI & WhatsApp</p>
      </div>
    </footer>
  );
}