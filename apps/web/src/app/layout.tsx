import "./(public)/css/style.css"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-white"> 
  {children}
</body>
    </html>
  );
}