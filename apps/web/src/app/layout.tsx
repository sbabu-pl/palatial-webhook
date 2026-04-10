import WhatsAppButton from "../components/WhatsAppButton";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans flex flex-col min-h-screen">
        
        {/* The new Navigation Bar at the top */}
        <Navbar />
        
        {/* This <main> tag ensures the content pushes the footer to the bottom */}
        <main className="flex-grow">
          {children}
        </main>

        {/* The new Footer at the bottom */}
        <Footer />

        {/* Global WhatsApp Button */}
        <WhatsAppButton />
      </body>
    </html>
  );
}