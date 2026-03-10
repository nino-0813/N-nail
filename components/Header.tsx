"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Gallery & Reviews", href: "/gallery" },
  { name: "Menu", href: "/menu" },
  { name: "Reservation", href: "/reservation" },
  { name: "Contact", href: "/contact#inquiry" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-serif tracking-widest text-stone-800"
        >
          N nail
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm tracking-widest hover:text-pink-300 transition-colors duration-300 uppercase ${
                pathname === link.href ? "text-pink-400" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservation"
            className="px-6 py-2 border border-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-300 text-sm tracking-widest uppercase"
          >
            Book Now
          </Link>
        </nav>

        <button
          className="md:hidden text-stone-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="メニュー"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-96 border-t border-stone-100"
            : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center py-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm tracking-widest hover:text-pink-300 transition-colors duration-300 uppercase ${
                pathname === link.href ? "text-pink-400" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/reservation"
            className="px-6 py-2 border border-stone-800 hover:bg-stone-800 hover:text-white transition-colors duration-300 text-sm tracking-widest uppercase"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
