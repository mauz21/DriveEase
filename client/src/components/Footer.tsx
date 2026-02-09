import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="font-display text-3xl font-bold tracking-tight text-white">
              Drive<span className="text-primary">Ease</span>
            </Link>
            <p className="text-gray-400">
              Premium vehicle rentals and professional chauffeur services for those who demand excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/cars" className="text-gray-400 hover:text-primary transition-colors">Our Fleet</Link></li>
              <li><Link href="/drivers" className="text-gray-400 hover:text-primary transition-colors">Chauffeurs</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-primary" />
                123 Luxury Lane, Beverly Hills, CA
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary" />
                concierge@driveease.com
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-gray-400">Subscribe for exclusive offers and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full rounded-lg bg-white/10 px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              />
              <button className="rounded-lg bg-[#FFD700] px-4 py-2 font-bold text-black hover:bg-[#FFD700]/90">
                Go
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} DriveEase Rentals. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-primary"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
