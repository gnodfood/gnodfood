import React, { useState, useEffect } from "react";
import { Phone, Menu, X, ShoppingBag, Sparkles, User } from "lucide-react";
import GnodLogo from "./GnodLogo";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface HeaderProps {
  onOrderNowClick: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAccount: () => void;
}

export default function Header({ onOrderNowClick, cartCount, onOpenCart, onOpenAccount }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setCurrentUser(usr);
    });
    return () => unsubscribe();
  }, []);

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

            {/* Cart Button with Count Badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-brand-blue-900 hover:text-[#0070f3] transition-all cursor-pointer flex items-center justify-center"
              title="Xem giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0070f3] text-white font-mono text-[9.5px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Button */}
            <button
              onClick={onOpenAccount}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-brand-blue-900 hover:text-[#0070f3] transition-all cursor-pointer flex items-center justify-center overflow-hidden"
              title="Hồ sơ tài khoản khách hàng"
            >
              {currentUser ? (
                <img 
                  src={currentUser.photoURL || ""} 
                  alt="Avatar" 
                  className="w-5 h-5 rounded-full object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.displayName || 'Gnod'}`;
                  }}
                />
              ) : (
                <User className="w-5 h-5 shrink-0" />
              )}
            </button>

            <button
              onClick={onOrderNowClick}
              className="flex items-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white px-5 py-2.5 rounded-full font-display font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Săn ưu đãi</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center space-x-2.5 lg:hidden">
            <a
              href="tel:0793754195"
              className="w-9 h-9 rounded-full bg-[#e6f4fe] flex items-center justify-center text-[#0070f3]"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>

            {/* Mobile Cart Button with Badge */}
            <button
              onClick={onOpenCart}
              className="relative w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue-900 hover:text-[#0070f3] transition-colors cursor-pointer"
              title="Xem giỏ hàng"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#0070f3] text-white font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Account trigger */}
            <button
              onClick={onOpenAccount}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue-900 hover:text-[#0070f3] transition-colors cursor-pointer overflow-hidden"
              title="Tài khoản của bạn"
            >
              {currentUser ? (
                <img 
                  src={currentUser.photoURL || ""} 
                  alt="Avatar" 
                  className="w-4.5 h-4.5 rounded-full object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.displayName || 'Gnod'}`;
                  }}
                />
              ) : (
                <User className="w-4.5 h-4.5 shrink-0" />
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-brand-blue-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-brand-blue-100 transition-all duration-300">
          <div className="px-4 pt-4 pb-6 space-y-4">
            
            {/* Nhóm ưu tiên hàng đầu: Gọi Tel, Giỏ Hàng, Hồ Sơ Hội Viên */}
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-brand-blue-100">
              {/* Gọi ngay hotline */}
              <a
                href="tel:0793754195"
                className="flex flex-col items-center justify-center p-3 bg-[#e6f4fe] hover:bg-[#d5ebfe] active:bg-[#c4e3fd] text-[#0070f3] rounded-2xl border border-blue-100 transition-colors cursor-pointer text-center"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0070f3] shadow-xs mb-1.5">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-display font-extrabold text-[11px] leading-tight text-brand-blue-950">Gọi Ngay</span>
                <span className="text-[9px] text-slate-500 font-mono font-medium mt-0.5">4195</span>
              </a>

              {/* Giỏ hàng đặc sản */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenCart();
                }}
                className="relative flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-brand-blue-900 rounded-2xl border border-slate-200/80 transition-colors cursor-pointer text-center"
              >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 shadow-xs mb-1.5 relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#0070f3] text-white font-mono text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="font-display font-extrabold text-[11px] leading-tight text-brand-blue-950">Giỏ Hàng</span>
                <span className="text-[9px] text-slate-500 mt-0.5">{cartCount > 0 ? `${cartCount} món` : "Trống"}</span>
              </button>

              {/* Tài khoản hội viên */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAccount();
                }}
                className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-brand-blue-900 rounded-2xl border border-brand-blue-100/70 transition-colors cursor-pointer text-center"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shadow-xs mb-1.5">
                  {currentUser ? (
                    <img 
                      src={currentUser.photoURL || ""} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.displayName || 'Gnod'}`;
                      }}
                    />
                  ) : (
                    <User className="w-4 h-4 text-slate-650" />
                  )}
                </div>
                <span className="font-display font-extrabold text-[11px] leading-tight text-brand-blue-950 truncate max-w-full">
                  {currentUser ? "Tài Khoản" : "Đăng Nhập"}
                </span>
                <span className="text-[9px] text-[#0070f3] font-bold mt-0.5">Gia đình Gnod ➜</span>
              </button>
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-4 py-2.5 rounded-xl font-display font-medium text-[14px] ${
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
              className="flex items-center justify-center space-x-2 w-full bg-brand-blue-900 hover:bg-[#0070f3] text-white py-3 rounded-xl font-display font-bold text-sm tracking-wide transition-colors shadow"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
              <span>SĂN ƯU ĐÃI ĐẶC SẢN</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
