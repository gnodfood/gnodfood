import React, { useState, useEffect } from "react";
import { Phone, Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import GnodLogo from "./GnodLogo";

interface HeaderProps {
  onOrderNowClick: () => void;
}

export default function Header({ onOrderNowClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section for highlight
      const sections = ["home", "story", "products", "recipe-planner", "blog", "customer-care", "careers"];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const navItems = [
    { label: "Trang chủ", id: "home" },
    { label: "Câu chuyện Gnod", id: "story" },
    { label: "Sản phẩm", id: "products" },
    { label: "Công thức Chef AI", id: "recipe-planner" },
    { label: "Cẩm nang Blog", id: "blog" },
    { label: "Chăm sóc khách hàng", id: "customer-care" },
    { label: "Tuyển dụng", id: "careers" }
  ];

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-blue-100 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => scrollToSection("home")}
          >
            <GnodLogo className="w-11 h-11 group-hover:scale-105" />
            <div>
              <span className="font-display font-black text-xl tracking-wider text-brand-blue-900 group-hover:text-brand-blue-500 transition-colors duration-200">
                GNOD FOOD
              </span>
              <span className="block text-[10.5px] font-semibold tracking-wide text-[#0070f3] -mt-0.5">
                Đậm vị - Sạch - chuẩn nhà làm
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-display text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer ${
                  activeSection === item.id
                    ? "text-[#0070f3] font-semibold border-b-2 border-[#0070f3] pb-1"
                    : "text-brand-blue-800 hover:text-[#0070f3]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Call To Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:0793754195"
              className="flex items-center space-x-2 text-brand-blue-900 hover:text-[#0070f3] font-medium text-sm transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#e6f4fe] flex items-center justify-center text-[#0070f3]">
                <Phone className="w-4 h-4" />
              </div>
              <span>079 375 4195</span>
            </a>
            <button
              onClick={onOrderNowClick}
              className="flex items-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white px-5 py-2.5 rounded-full font-display font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Đặt giao ngay</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center space-x-3 lg:hidden">
            <a
              href="tel:0793754195"
              className="w-10 h-10 rounded-full bg-[#e6f4fe] flex items-center justify-center text-[#0070f3]"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-brand-blue-100 transition-all duration-300">
          <div className="px-4 pt-2 pb-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl font-display font-medium text-base ${
                  activeSection === item.id
                    ? "bg-[#e6f4fe] text-[#0070f3]"
                    : "text-brand-blue-800 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOrderNowClick();
              }}
              className="flex items-center justify-center space-x-2 w-full bg-brand-blue-900 hover:bg-[#0070f3] text-white py-3.5 rounded-xl font-display font-medium text-base transition-colors shadow"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Đặt giao ngay</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
