'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Atom, BookOpen, FlaskConical, Star, User } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'الرئيسية', icon: <Atom size={16} /> },
  { href: '/subjects', label: 'المواد', icon: <BookOpen size={16} /> },
  { href: '/lab', label: 'المختبر', icon: <FlaskConical size={16} /> },
  { href: '/activities', label: 'أنشطتي', icon: <Star size={16} /> },
  { href: '/teacher', label: 'المعلم', icon: <User size={16} /> },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-nawah-900/95 backdrop-blur-md border-b border-nawah-teal/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-nawah-teal rounded-full opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="absolute inset-1 border-2 border-nawah-teal rounded-full" />
              <div className="absolute inset-[6px] bg-nawah-teal rounded-full group-hover:scale-110 transition-transform" />
            </div>
            <span
              className="text-xl font-black text-white"
              style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
            >
              نواة
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-nawah-teal hover:bg-nawah-teal/10 transition-all duration-200"
                style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
              >
                <span className="text-nawah-teal">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login" className="btn-outline text-sm px-4 py-2 rounded-lg">
              تسجيل الدخول
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm px-4 py-2 rounded-lg">
              إنشاء حساب
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-300 hover:text-nawah-teal transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-nawah-800/98 backdrop-blur-md border-t border-nawah-teal/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-nawah-teal hover:bg-nawah-teal/10 transition-all"
                style={{ fontFamily: 'Noto Kufi Arabic, serif' }}
              >
                <span className="text-nawah-teal">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-nawah-700 flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setOpen(false)} className="btn-outline text-center text-sm py-2.5 rounded-lg">
                تسجيل الدخول
              </Link>
              <Link href="/auth/register" onClick={() => setOpen(false)} className="btn-primary text-center text-sm py-2.5 rounded-lg">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
