"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const products = [
    { name: "Motor Insurance", href: "/motor" },
    { name: "Life Insurance", href: "/life" },
    { name: "Education Cover", href: "/education" },
    { name: "Medical Cover", href: "/medical" },
    { name: "Home Insurance", href: "/home" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="block">
              <Image 
                src="/logo-horizontal.png" 
                alt="Palatial Insurance Agency" 
                width={280} 
                height={115} 
                className="h-16 md:h-18 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-charcoal hover:text-primary font-medium transition">Home</Link>
            
            {/* Products Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button className="flex items-center gap-1 text-charcoal group-hover:text-primary font-medium transition py-8">
                Products
                <svg className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProductsOpen && (
                <div className="absolute top-full -left-4 w-56 bg-white border border-gray-100 shadow-xl rounded-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {products.map((product) => (
                    <Link 
                      key={product.href} 
                      href={product.href}
                      className="block px-6 py-2.5 text-sm text-charcoal hover:bg-gray-50 hover:text-primary transition"
                    >
                      {product.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/claims" className="text-charcoal hover:text-primary font-medium transition">Claims Support</Link>
            
            <a 
              href="https://wa.me/254722606608?text=Hi%20Palatial,%20I%20need%20a%20quote" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold transition shadow-md"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-charcoal hover:text-primary focus:outline-none"
            >
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-6 py-6 space-y-4 shadow-lg absolute w-full z-50">
          <Link href="/" className="block text-lg font-bold text-primary" onClick={() => setIsOpen(false)}>Home</Link>
          <div className="space-y-3 pl-2 border-l-2 border-palace-gold/30">
            <p className="text-xs font-black text-charcoal/40 uppercase tracking-widest">Our Products</p>
            {products.map((product) => (
              <Link 
                key={product.href} 
                href={product.href} 
                className="block text-charcoal font-medium"
                onClick={() => setIsOpen(false)}
              >
                {product.name}
              </Link>
            ))}
          </div>
          <Link href="/claims" className="block text-lg font-bold text-primary pt-2" onClick={() => setIsOpen(false)}>Claims Support</Link>
        </div>
      )}
    </nav>
  );
}