import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative text-stone-700 py-16 md:py-24 overflow-hidden">
      {/* 大理石風背景 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/marble-footer.png"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-white/60" aria-hidden />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-serif text-stone-800 tracking-widest mb-6">
              N nail
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-sm font-light">
              広島県福山市駅家町のネイルサロン。<br />
              落ち着いた空間で、あなただけの特別な時間をお過ごしください。
            </p>
            <div className="flex gap-4 mt-8">
              <a href="https://www.instagram.com/chii.nino3/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-600 hover:bg-pink-100 hover:text-pink-600 transition-colors duration-300" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-600 hover:bg-pink-100 hover:text-pink-600 transition-colors duration-300" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-600 hover:bg-pink-100 hover:text-pink-600 transition-colors duration-300" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-stone-800 font-serif tracking-widest mb-6 uppercase text-sm">
              Quick Links
            </h3>
            <ul className="space-y-4 text-sm font-light text-stone-600">
              <li><Link href="/" className="hover:text-pink-600 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-pink-600 transition-colors">About</Link></li>
              <li><Link href="/gallery" className="hover:text-pink-600 transition-colors">Gallery</Link></li>
              <li><Link href="/menu" className="hover:text-pink-600 transition-colors">Menu</Link></li>
              <li><Link href="/reservation" className="hover:text-pink-600 transition-colors">Reservation</Link></li>
              <li><Link href="/contact" className="hover:text-pink-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-stone-800 font-serif tracking-widest mb-6 uppercase text-sm">
              Contact
            </h3>
            <div className="space-y-4 text-sm font-light text-stone-600">
              <p>
                <Link href="/reservation" className="hover:text-pink-600 transition-colors underline underline-offset-2">
                  こちらからご予約
                </Link>
              </p>
              <p>
                <Link href="/contact#inquiry" className="hover:text-pink-600 transition-colors underline underline-offset-2">
                  こちらからお問い合わせ
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-300/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-stone-500">
          <p>&copy; {new Date().getFullYear()} N nail. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-stone-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-700 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
