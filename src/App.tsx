import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import GnodLogo from "./components/GnodLogo";
import AIChef from "./components/AIChef";
import BlogSection from "./components/BlogSection";
import AIChatbot from "./components/AIChatbot";
import CartDrawer from "./components/CartDrawer";
import AccountDrawer from "./components/AccountDrawer";
import { PRODUCTS, CAREER_OPPORTUNITIES, REVIEWS } from "./data";
import { Product, CareerOpportunity, CartItem } from "./types";
import heroStingrayImg from "./assets/images/gnod_hero_seafood_1780066797741.png";
import {
  Award,
  Compass,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Users,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  Send,
  Briefcase,
  Clock,
  Heart,
  Plus,
  Minus,
  Sparkles,
  Check,
  Info,
  ExternalLink,
  Eye,
  Target,
  HelpCircle,
  HeartHandshake,
  FileText,
  Upload,
  RefreshCw,
  Truck,
  ShoppingBag
} from "lucide-react";

export default function App() {
  // Navigation callback
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 85,
        behavior: "smooth"
      });
    }
  };

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("gnod_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem("gnod_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty,
          unit: product.unit
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Product interactivity state
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [successOrderMsg, setSuccessOrderMsg] = useState<string | null>(null);

  // Quick Order dialog
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product>(PRODUCTS[0]);
  const [quickOrderQty, setQuickOrderQty] = useState(1);

  // Review sliding index
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Image zoom state for details
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Customer care & Careers state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [careFormSuccess, setCareFormSuccess] = useState<boolean>(false);
  const [applyingJob, setApplyingJob] = useState<CareerOpportunity | null>(null);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [careerFormSuccess, setCareerFormSuccess] = useState<string | null>(null);

  const handleQuickOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneInput = (e.target as any).elements.quickPhone.value;
    const nameInput = (e.target as any).elements.quickName.value;
    const addressInput = (e.target as any).elements.quickAddress?.value || "";

    if (!nameInput || !phoneInput) {
      alert("Vui lòng điền Họ tên và Số điện thoại.");
      return;
    }

    try {
      const msg = `Đặt đơn nhanh: ${quickOrderQty} x ${quickOrderProduct.name}. Địa chỉ giao hàng: ${addressInput}`;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameInput,
          phone: phoneInput,
          email: "",
          message: msg,
          interest: "Đặt hàng nhanh"
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessOrderMsg(`Yêu cầu đặt mua ${quickOrderQty} ${quickOrderProduct.name} thành công! Gnod Food đã ghi nhận thông tin đặt hàng nhanh cho số điện thoại: ${phoneInput}. Trực tổng đài sẽ gọi xác nhận trong 10 phút.`);
        setTimeout(() => {
          setIsQuickOrderOpen(false);
          setSuccessOrderMsg(null);
          setQuickOrderQty(1);
        }, 5000);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Lỗi đặt đơn: " + err.message);
    }
  };

  const calculateTotalPrice = (priceStr: string, qty: number): string => {
    const numericPrice = parseInt(priceStr.replace(/\./g, ""), 10);
    return (numericPrice * qty).toLocaleString("vi-VN") + " VND";
  };

  const handleCareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const name = (target.elements.namedItem("careName") as HTMLInputElement).value;
    const phone = (target.elements.namedItem("carePhone") as HTMLInputElement).value;
    const email = (target.elements.namedItem("careEmail") as HTMLInputElement).value || "";
    const message = (target.elements.namedItem("careMessage") as HTMLTextAreaElement).value || "";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          interest: "Chăm sóc khách hàng & Yêu cầu hỗ trợ"
        })
      });

      if (response.ok) {
        setCareFormSuccess(true);
        target.reset();
        setTimeout(() => setCareFormSuccess(false), 5000);
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Gửi yêu cầu thất bại: " + err.message);
    }
  };

  const handleCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    const target = e.target as HTMLFormElement;
    const name = (target.elements.namedItem("candidateName") as HTMLInputElement).value;
    const phone = (target.elements.namedItem("candidatePhone") as HTMLInputElement).value;
    const email = (target.elements.namedItem("candidateEmail") as HTMLInputElement).value || "";
    const profile = (target.elements.namedItem("candidateProfile") as HTMLInputElement).value || "";
    const intro = (target.elements.namedItem("candidateIntro") as HTMLTextAreaElement).value || "";

    const fullMessage = `Bài ứng tuyển vị trí: ${applyingJob.title}\nSố điện thoại: ${phone}\nEmail: ${email}\nLink Zalo/Facebook/LinkedIn: ${profile}\nĐính kèm CV: ${attachedFileName || "Chưa gửi file"}\nLời giới thiệu:\n${intro}`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message: fullMessage,
          interest: `Tuyển dụng: ${applyingJob.title}`
        })
      });

      if (response.ok) {
        setCareerFormSuccess(`Đơn ứng tuyển của bạn cho vị trí "${applyingJob.title}" đã được gửi thành công đến phòng Nhân sự Gnod Food! Chúng tôi sẽ liên hệ phỏng vấn qua SĐT: ${phone} trong vòng 24 - 48h.`);
        target.reset();
        setAttachedFileName(null);
        setTimeout(() => {
          setApplyingJob(null);
          setCareerFormSuccess(null);
        }, 6000);
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (err: any) {
      alert("Nộp đơn thất bại: " + err.message);
    }
  };

  const handleFileDropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="bg-brand-sand min-h-screen text-brand-blue-900 selection:bg-brand-blue-100 selection:text-brand-blue-900 transition-colors duration-300">
      
      {/* Sticky header nav */}
      <Header 
        onOrderNowClick={scrollToProducts} 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* Floating Call Bar (Mobile Exclusive) */}
      <div id="mobile-quick-call" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-2xl border-t border-brand-blue-100 py-3.5 px-4 flex justify-around items-center lg:hidden">
        <a
          href="tel:0793754195"
          id="btn-call-phone-mobile"
          className="flex-1 max-w-[45%] flex items-center justify-center space-x-2 bg-[#0070f3] text-white py-3 rounded-xl font-display font-bold text-sm tracking-wide shadow-md active:scale-95 transition-all"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span>GỌI NGAY</span>
        </a>
        <button
          onClick={() => {
            setQuickOrderProduct(PRODUCTS[0]);
            setIsQuickOrderOpen(true);
          }}
          id="btn-quick-order-mobile"
          className="flex-1 max-w-[45%] flex items-center justify-center space-x-2 bg-brand-blue-900 text-white py-3 rounded-xl font-display font-bold text-sm tracking-wide shadow-md active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>MUA HÀNG</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO CONTAINER (TRANG CHỦ) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative pt-24 pb-16 lg:pt-36 lg:pb-32 overflow-hidden flex flex-col justify-center border-b border-brand-blue-100/50"
      >
        {/* Subtle Decorative Ocean Overlay Design */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue-50/35 to-transparent -z-10 pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-blue-100/20 rounded-full filter blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div id="badge-top-hero" className="inline-flex items-center space-x-2 bg-brand-blue-100/60 border border-[#b2d8f7] rounded-full py-1.5 px-4 text-brand-blue-800 text-xs font-semibold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-[#0070f3]" />
                <span>TIÊU CHUẨN ẨM THỰC</span>
              </div>
              
              <h1 id="hero-heading" className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-brand-blue-900">
                Khô Hải Sản <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-900 via-[#0070f3] to-brand-blue-700">
                  Gnod Food
                </span>
              </h1>
              
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                Không chỉ là hải sản phơi sấy, Gnod Food mang tinh hoa và vị ngọt nguyên bản từ giàn phơi đại dương bãi cát Việt Nam tới bàn tiệc của khách quý. 100% tự nhiên, sạch bóng và dầy đặc dinh dưỡng cát biển.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    const el = document.getElementById("products");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  id="btn-explore-catalog"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white px-8 py-3.5 rounded-full font-display font-bold text-sm tracking-wider transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Khám phá sản phẩm</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Minimal Trust Badge Grid */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <span className="block font-display font-black text-2xl text-brand-blue-900">100%</span>
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Nguyên chất tự nhiên</span>
                </div>
                <div>
                  <span className="block font-display font-black text-2xl text-brand-blue-900">Vũng Tàu</span>
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Giao trực tiếp từ nguồn</span>
                </div>
                <div>
                  <span className="block font-display font-black text-2xl text-brand-blue-900">0%</span>
                  <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block">Chất tạo nạc & phẩm màu</span>
                </div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-md sm:max-w-lg aspect-square">
                {/* Decorative Solid back panels */}
                <div className="absolute inset-4 bg-brand-blue-100 rounded-3xl transform rotate-3 -z-10" />
                <div className="absolute inset-4 bg-slate-100/80 rounded-3xl transform -rotate-2 -z-10 border border-brand-blue-50" />
                
                {/* Generated Premium Image */}
                <img
                  src={heroStingrayImg}
                  alt="Khô cá đuối Gnod Food kèm mắm me"
                  id="img-hero-seafood"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top rounded-3xl shadow-xl border border-[#e2edf5] transition-transform duration-700 hover:scale-[1.02]"
                />
                
                {/* Hanging floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white border border-brand-blue-100 p-4 rounded-2xl shadow-xl max-w-[200px] hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-[#e6f4fe] flex items-center justify-center text-[#0070f3] shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-display font-extrabold text-xs text-brand-blue-900">Vệ Sinh 100%</span>
                    </div>
                  </div>
                </div>

                {/* Hanging floating badge 2 */}
                <div className="absolute top-12 -right-6 bg-brand-blue-900 text-white p-3.5 rounded-2xl shadow-xl max-w-[170px] hidden sm:block border border-brand-blue-700">
                  <span className="block text-[10px] text-brand-blue-100 uppercase font-semibold tracking-wider">HƯƠNG VỊ BIỂN</span>
                  <p className="font-display font-bold text-xs tracking-tight mt-0.5">
                    Từng thớ thịt thơm lừng, dai mềm, càng nhai càng ngọt
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 2: BRAND STORY (CÂU CHUYỆN THƯƠNG HIỆU) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="story" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Headline setup */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">Sứ mệnh từ đại dương</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight uppercase">
              HÀNH TRÌNH GÌN GIỮ TINH HOA ĐẠI DƯƠNG
            </h2>
            <div className="w-12 h-1 bg-[#0070f3] mx-auto rounded-full" />
            <div className="text-slate-500 text-sm leading-relaxed pt-2 space-y-4">
              <p>
                Từ những chuyến tàu vươn khơi giữa biển lớn, Gnod Food mang theo khát vọng lưu giữ trọn vẹn hương vị nguyên bản của đại dương trong từng sản phẩm hải sản khô trao đến người tiêu dùng.
              </p>
              <p>
                Chúng tôi tin rằng, giá trị thật sự của một món ăn không nằm ở sự cầu kỳ, mà bắt đầu từ sự tử tế với nguyên liệu. Vì vậy, mỗi sản phẩm tại Gnod Food đều được tuyển chọn kỹ lưỡng, chế biến theo quy trình đảm bảo vệ sinh 100%, hạn chế phụ gia, giữ trọn độ tươi ngon tự nhiên của hải sản.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Bento story cell 1 */}
            <div className="bg-brand-sand/60 border border-brand-blue-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#e6f4fe] rounded-xl flex items-center justify-center text-[#0070f3] mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Hương vị thượng hạng</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Từng thớ cá nướng thơm lừng sực nức, sấy nướng dẻo dai vừa tầm, càng nhai càng cảm nhận rõ vị ngọt lành tự nhiên đặc biệt của cá đuối đại dương.
              </p>
            </div>

            {/* Bento story cell 2 */}
            <div className="bg-brand-sand/60 border border-brand-blue-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#e6f4fe] rounded-xl flex items-center justify-center text-[#0070f3] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Bảo tồn tự nhiên</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Nói KHÔNG với chất bảo quản, hóa chất xử lý mốc hay hương liệu hóa học. Gnod chú trọng kỹ nghệ muối ướp nhạt để thực khách hưởng vị bùi và ngọt mộc.
              </p>
            </div>

            {/* Bento story cell 3 */}
            <div className="bg-brand-sand/60 border border-brand-blue-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#e6f4fe] rounded-xl flex items-center justify-center text-[#0070f3] mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Phơi nắng tinh xảo</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Từng thớ cá khô được xếp căng góc trên giàn sào gỗ hứng tia nắng giòn biển Vũng Tàu, giữ trọn vẹn vị ngọt tự nhiên, dai ngon, đậm đà đặc trưng của biển cả.
              </p>
            </div>

            {/* Bento story cell 4 */}
            <div className="bg-brand-sand/60 border border-brand-blue-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#e6f4fe] rounded-xl flex items-center justify-center text-[#0070f3] mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Hũ đựng hiện đại, tiện lợi</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Thiết kế hũ nhựa tròn trong suốt hiện đại sang trọng với nắp nhôm vặn kín kẽ, giúp bảo quản khô cá luôn khô ráo, giữ trọn vị ngon đượm đà và vô cùng tiện lợi khi mang theo.
              </p>
            </div>

          </div>

          {/* TRỤ CỘT CHIẾN LƯỢC: TẦM NHÌN, SỨ MỆNH, ĐỊNH VỊ, GIÁ TRỊ CỐT LÕI */}
          <div className="mt-20 border-t border-brand-blue-100/30 pt-16">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">Định hướng Gnod</span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-blue-900 tracking-tight uppercase">
                Bốn Trụ Cột Phát Triển Bền Vững
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm">
                Định hướng chiến lược và hệ giá trị nhân văn đưa thương hiệu Gnod Food đồng hành gắn bó cùng hàng triệu bàn ăn Việt.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1: Tầm nhìn */}
              <div className="relative overflow-hidden bg-gradient-to-tr from-brand-sand/40 to-white border border-brand-blue-100/40 rounded-2xl p-8 hover:shadow-lg hover:border-[#a3e3fc] transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-100/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 text-[#0070f3] rounded-xl flex items-center justify-center shadow-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Tầm Nhìn Chiến Lược</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Trở thành biểu tượng uy tín hàng đầu trong lĩnh vực khô hải sản sạch cao cấp tại Việt Nam. Đồng thời, nâng tầm thói quen thưởng thức đặc sản khô truyền thống lên chuẩn mực mới – sạch sẽ, sang trọng, tiện dụng, tự tin đưa tinh hoa biển Việt vươn tầm toàn cầu.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Sứ mệnh */}
              <div className="relative overflow-hidden bg-gradient-to-tr from-brand-sand/40 to-white border border-brand-blue-100/40 rounded-2xl p-8 hover:shadow-lg hover:border-[#a3e3fc] transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-100/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 text-[#0070f3] rounded-xl flex items-center justify-center shadow-sm">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Sứ Mệnh Cao Cả</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Lưu giữ tinh túy ngọt ngào nguyên bản của biển khơi; kiên quyết bảo vệ sức khỏe triệu gia đình qua chuỗi tiêu chuẩn kiểm định <strong className="text-brand-blue-900 font-semibold">"4 KHÔNG"</strong> cực đoan. Mang đến bữa ngon rộn rã gắn kết tình thân trọn vẹn của thực khách.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3: Định vị */}
              <div className="relative overflow-hidden bg-gradient-to-tr from-brand-sand/40 to-white border border-brand-blue-100/40 rounded-2xl p-8 hover:shadow-lg hover:border-[#a3e3fc] transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-100/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 text-[#0070f3] rounded-xl flex items-center justify-center shadow-sm">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Định Vị Phong Cách</h4>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      Là thương hiệu tiên phong đại diện cho phong cách <strong className="text-brand-blue-900 font-semibold">Khô Hải Sản Sạch Thượng Hạng</strong>. Định hình phong vị ẩm thực hiện đại "ngọt nhạt tự nhiên" – hạn chế muối, nâng tầm quy cách đóng gói hũ trong tinh tế làm quà tặng chữ TÂM.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: Giá trị cốt lõi */}
              <div className="relative overflow-hidden bg-gradient-to-tr from-brand-sand/40 to-white border border-brand-blue-100/40 rounded-2xl p-8 hover:shadow-lg hover:border-[#a3e3fc] transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue-100/10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
                <div className="flex items-start space-x-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 text-[#0070f3] rounded-xl flex items-center justify-center shadow-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <h4 className="font-display font-bold text-lg text-brand-blue-900 mb-2">Giá Trị Cốt Lõi (3T)</h4>
                    <ul className="text-slate-600 text-[11px] sm:text-xs space-y-2 leading-relaxed">
                      <li className="flex items-start">
                        <span className="text-[#0070f3] mr-1.5 font-bold">•</span>
                        <span><strong className="text-brand-blue-900 font-semibold">TÂM (Tử Tế)</strong>: Kinh doanh lấy chữ Tâm làm gốc, chăm chút thớ cá phơi khô sạch sẽ nhất bằng cả tấm lòng.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#0070f3] mr-1.5 font-bold">•</span>
                        <span><strong className="text-brand-blue-900 font-semibold">TÍN (Sạch Cực Đoan)</strong>: Tuyệt đối giữ gìn cam kết an toàn, bảo vệ lòng tin tuyệt đối của khách hàng sành ăn.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[#0070f3] mr-1.5 font-bold">•</span>
                        <span><strong className="text-brand-blue-900 font-semibold">TRƯỜNG (Bền Vững)</strong>: Đồng hành cùng ngư dân miền biển tạo dựng giá trị sinh kế văn minh bền chặt.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Large split highlight story */}
          <div className="mt-16 bg-[#e6f4fe]/30 rounded-3xl border border-[#d6eaf9] p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0070f3] font-mono">Bí quyết cổ truyền Gnod</span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-blue-900 tracking-tight">
                  Công Thức Khô Vị Ngọt Nhạt - Sự khắt khe trong ẩm thực đương đại
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ở Gnod Food, chúng tôi hiểu rằng hải sản khô không nhất thiết phải mặn đắng để có thể bảo quản. Bằng phương pháp luộc sấy chậm cảm ứng công nghệ sinh học đột phá và đóng gói vô trùng hút chân không kép, khô Gnod đạt độ mặn cực kỳ dễ chịu, bảo toàn hàm lượng đạm cao và trọn vẹn vị ngọt dẻo sâu nơi cuối lưỡi. Mỗi cá thể mực, tôm khi nướng hoặc chế biến đều đượm mùi nguyên sơ sạch sẽ.
                </p>
                <div className="flex items-center space-x-6 pt-2">
                  <div className="flex items-center space-x-2 text-brand-blue-900">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Hương Vị Mộc</span>
                  </div>
                  <div className="flex items-center space-x-2 text-brand-blue-900">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-wider">Vô trùng Kép</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-white border border-[#cbe1f2] p-4 rounded-2xl shadow-md rotate-1 max-w-[340px] text-center space-y-3">
                  <span className="font-display font-black text-4xl text-brand-blue-900">30+</span>
                  <p className="font-display font-bold text-xs text-brand-blue-800">
                    Nghệ nhân dày dạn kinh nghiệm
                  </p>
                  <p className="text-slate-400 text-[10px] leading-relaxed">
                    Sản phẩm được tuyển tay thủ công, chọn lọc kỹ lưỡng
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 3: PRODUCTS SHOWCASE (DANH MỤC SẢN PHẨM) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="products" className="py-20 bg-brand-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">SẢN PHẨM</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight">
              Sản Phẩm Đóng Gói Tinh Hoa Gnod Food
            </h2>
            <div className="w-12 h-1 bg-brand-blue-900 mx-auto rounded-full" />
            <p className="text-slate-500 text-sm leading-relaxed pt-2">
              Mỗi sản phẩm Gnod Food là một lời cam kết về chất lượng, sự chỉn chu và hương vị chân thật nhất.
            </p>
          </div>

          {/* Grid products catalog */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((prod) => {
              return (
                <div
                  key={prod.id}
                  id={`card-product-${prod.id}`}
                  className="bg-white rounded-2xl border border-brand-blue-100/60 shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-between group transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Floating Product Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {prod.tags.map((tag, i) => (
                        <span key={i} className="bg-brand-blue-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="block text-[11px] font-mono tracking-widest uppercase text-slate-400 mb-1">
                        {prod.subName}
                      </span>
                      <h3 className="font-display font-bold text-lg text-brand-blue-900 leading-snug group-hover:text-[#0070f3] transition-colors">
                        {prod.name}
                      </h3>
                      <p className="text-[#0070f3] font-display font-extrabold text-xl mt-2">
                        {prod.price} <span className="text-xs text-slate-500 font-semibold font-sans">/ {prod.unit}</span>
                        {prod.originalPrice && (
                          <span className="text-xs text-slate-400 font-normal line-through ml-2">
                            {prod.originalPrice} VND
                          </span>
                        )}
                      </p>
                      <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">
                        {prod.description}
                      </p>
                    </div>

                    {/* Features list bullet points */}
                    <div className="border-t border-slate-50 pt-4">
                      <h4 className="text-[11px] font-bold text-brand-blue-900 uppercase tracking-widest mb-2">Đặc điểm nổi bật:</h4>
                      <ul className="space-y-1">
                        {prod.details.slice(0, 2).map((det, i) => (
                          <li key={i} className="flex items-start space-x-2 text-[11.5px] text-slate-600">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                            <span>{det}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button actions on-card */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-50">
                      <button
                        onClick={() => handleAddToCart(prod, 1)}
                        className="w-full py-2.5 px-4 bg-brand-blue-900 hover:bg-[#0070f3] text-white rounded-xl text-xs font-bold tracking-wider font-display transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm hover:shadow"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>Thêm vào giỏ</span>
                      </button>
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => {
                            setSelectedProductDetails(prod);
                            setOrderQuantity(1);
                          }}
                          className="flex-1 py-1.5 px-2 bg-[#e6f4fe] hover:bg-[#d5ebfe] text-[#0070f3] rounded-lg text-[11px] font-bold tracking-tight font-display transition-colors cursor-pointer text-center"
                        >
                          Xem chi tiết
                        </button>
                        <button
                          onClick={() => {
                            setQuickOrderProduct(prod);
                            setQuickOrderQty(1);
                            setIsQuickOrderOpen(true);
                          }}
                          className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-250 text-slate-700 rounded-lg text-[11px] font-bold tracking-tight font-display transition-colors cursor-pointer"
                        >
                          Mua nhanh 2H
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct call action banner */}
          <div className="mt-16 text-center bg-white border border-brand-blue-100 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto shadow-sm">
            <h3 className="font-display font-bold text-lg text-[#00a3ff] mb-1 uppercase tracking-widest">HƯƠNG VỊ BIỂN KHƠI</h3>
            <p className="font-display font-extrabold text-2xl text-brand-blue-900 mb-4 tracking-tight">
              Gnod Food cung cấp khô hải sản chất lượng
            </p>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mb-6">
              Gnod food - Nơi hương vị nguyên bản của đại dương gặp gỡ sự chuẩn mực trong từng quy trình
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="tel:0793754195"
                className="flex items-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white px-6 py-3 rounded-xl font-display font-bold text-sm tracking-wide transition-all shadow-md hover:scale-[1.01]"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Hotline: 079 375 4195</span>
              </a>
              <button
                onClick={scrollToProducts}
                className="flex items-center space-x-1 hover:text-[#0070f3] text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                <span>Xem nhanh dòng sản phẩm chính</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>


      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 4: AI RECIPE PLANNER (Ý TƯỞNG BẾP TRƯỞNG AI) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="recipe-planner" className="py-20 bg-white border-b border-brand-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">SÁNG TẠO ẨM THỰC</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight select-none">
              Ý TƯỞNG BÀN TIỆC & CÔNG THỨC CHEF AI
            </h2>
            <div className="w-12 h-1 bg-[#0070f3] mx-auto rounded-full" />
          </div>
          <AIChef />
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION BLOG: SEO OPTIMIZED BLOG ENTRIES (CẨM NANG BẾP) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="blog" className="py-20 bg-slate-50 border-b border-brand-blue-100/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="blog-header" className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">
              GÓC CHIA SẺ & CẨM NANG
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight">
              CỔNG THÔNG TIN & CẨM NANG GIA ĐÌNH
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Cập nhật tri thức bồi bổ sức khỏe cùng cẩm nang lựa chọn khô mực câu thơm ngọt tự nhiên và cách nướng khô cá đuối mắm me cực chuẩn từ Gnod Food.
            </p>
            <div className="w-12 h-1 bg-[#0070f3] mx-auto rounded-full" />
          </div>
          <BlogSection />
        </div>
      </section>



      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 5: CUSTOMER REVIEWS (Ý KIẾN KHÁCH HÀNG) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-20 bg-[#e6f4fe]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">Đồng hành cùng hạnh phúc</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight">
              Khách Hàng Nói Gì Về Gnod Food?
            </h2>
            <div className="w-12 h-1 bg-brand-blue-900 mx-auto rounded-full" />
          </div>

          {/* Simple Slider Reviews layout */}
          <div className="max-w-4xl mx-auto bg-white border border-[#d2e4f3] rounded-3xl p-8 sm:p-12 shadow-sm relative">
            <div className="absolute top-6 left-6 text-slate-100 text-8xl font-serif leading-none select-none pointer-events-none">
              “
            </div>

            <div className="text-center space-y-6 relative z-10">
              <p className="text-brand-blue-900 text-lg sm:text-xl font-medium leading-relaxed italic">
                "{REVIEWS[currentReviewIndex].comment}"
              </p>

              {/* Rating stars */}
              <div className="flex justify-center text-amber-400 space-x-1">
                {Array.from({ length: REVIEWS[currentReviewIndex].rating }).map((_, i) => (
                  <span key={i} className="text-xl">★</span>
                ))}
              </div>

              {/* Author Info */}
              <div className="flex flex-col items-center">
                <img
                  src={REVIEWS[currentReviewIndex].avatar}
                  alt={REVIEWS[currentReviewIndex].author}
                  className="w-14 h-14 rounded-full border-2 border-[#0070f3] mb-3 object-cover"
                />
                <h4 className="font-display font-bold text-base text-brand-blue-900">
                  {REVIEWS[currentReviewIndex].author}
                </h4>

              </div>

              {/* Navigation dots */}
              <div className="flex justify-center space-x-2.5 pt-4">
                {REVIEWS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentReviewIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                      currentReviewIndex === idx ? "bg-[#0070f3] px-3" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 6: CHĂM SÓC KHÁCH HÀNG (CUSTOMER CARE) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="customer-care" className="py-20 bg-white border-b border-brand-blue-100/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">SỰ HÀI LÒNG CỦA BẠN LÀ KIM CHỈ NAM</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight">
              Trung Tâm Chăm Sóc Khách Hàng
            </h2>
            <p className="text-slate-500 text-sm">
              Chúng tôi luôn ở đây để lắng nghe, giải đáp thắc mắc và hỗ trợ xử lý mọi nhu cầu của bạn với sự tử tế và chu đáo nhất.
            </p>
            <div className="w-12 h-1 bg-[#0070f3] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Cam kết Dịch vụ & Hỏi đáp Accordion */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="font-display font-extrabold text-xl text-brand-blue-900 mb-6 flex items-center gap-2">
                  <HeartHandshake className="w-6 h-6 text-[#0070f3]" />
                  <span>3 Chính Sách Vàng Từ Gnod Food</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-brand-sand border border-brand-blue-100 rounded-2xl p-5 space-y-2">
                    <div className="w-9 h-9 bg-[#e6f4fe] rounded-lg flex items-center justify-center text-[#0070f3]">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-blue-900">Bao Đổi Trả 7 Ngày</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Nhận hàng không ưng ý, hôi dầu hoặc bị mốc do vận chuyển? Gnod hoàn trả tiền 100% không phiền hà.
                    </p>
                  </div>
                  <div className="bg-brand-sand border border-brand-blue-100 rounded-2xl p-5 space-y-2">
                    <div className="w-9 h-9 bg-[#e6f4fe] rounded-lg flex items-center justify-center text-[#0070f3]">
                      <Truck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-blue-900">Giao Hỏa Tốc 2H</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Nội thành TP.HCM và TP.Vũng Tàu giao gấp trong 2 tiếng để giữ nguyên vị giòn tươi sần sật.
                    </p>
                  </div>
                  <div className="bg-brand-sand border border-brand-blue-100 rounded-2xl p-5 space-y-2">
                    <div className="w-9 h-9 bg-[#e6f4fe] rounded-lg flex items-center justify-center text-[#0070f3]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-blue-900">Chuẩn Sạch 100%</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tiêu chuẩn an toàn nghiêm ngặt 4 Không tuyệt đối để kiểm định gác bếp tự nhiên bảo vệ cả nhà.
                    </p>
                  </div>
                </div>
              </div>

              {/* Accordion FAQ */}
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-xl text-brand-blue-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-[#0070f3]" />
                  <span>Câu Hỏi Thường Gặp (FAQs)</span>
                </h3>

                {[
                  {
                    q: "Khô hải sản Gnod Food bảo quản như thế nào để giữ độ ngon lâu nhất?",
                    a: "Các sản phẩm của Gnod Food không sử dụng hóa chất bảo quản cực đoan. Để ở nhiệt độ phòng khô ráo tránh ánh nắng trực tiếp giữ tốt từ 15-30 ngày kể từ ngày đóng hũ. Để duy trì thớ cá ngọt mềm mọng sần sật lên đến 6 tháng, quý khách nên trữ trong ngăn mát hoặc ngăn đông tủ lạnh."
                  },
                  {
                    q: "Sản phẩm Gnod Food tại sao có vị ngọt nhẹ nhạt muối hơn thị trường?",
                    a: "Chúng tôi áp dụng phương pháp ướp nhạt muối gia truyền. Hướng đi này giúp bảo vệ tối đa độ tươi ngọt nguyên bản của mực, cá đuối nghệ sụn và tôm đất tự nhiên, tránh cảm giác mặn chát của hoá chất nêm nếm muối bừa bãi thông thường."
                  },
                  {
                    q: "Gnod Food có vận chuyển toàn quốc và có đồng kiểm hàng không?",
                    a: "Dạ có! Gnod Food đóng thùng xốp chuyên dụng, hút chân không kỹ càng để vận chuyển tới mọi tỉnh thành (từ 1-4 ngày). Đặc biệt, quý khách luôn được đồng kiểm hàng trước khi thanh toán cho bưu tá để đảm bảo cam kết vàng 100% sạch sẽ chuẩn nét."
                  }
                ].map((faq, index) => {
                  const isExpanded = expandedFaq === index;
                  return (
                    <div 
                      key={index} 
                      className="border border-brand-blue-100 rounded-2xl bg-slate-50 overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : index)}
                        className="w-full text-left px-6 py-4 flex items-center justify-between font-display font-bold text-sm text-brand-blue-900 hover:text-[#0070f3] focus:outline-none transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <span className="text-lg font-bold text-slate-400">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="px-6 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-brand-blue-100/50 bg-white">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Dynamic submission support form */}
            <div className="lg:col-span-5">
              <div className="bg-brand-sand border border-[#cbdef0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0070f3]/5 rounded-bl-full pointer-events-none" />
                
                <div>
                  <h4 className="font-display font-extrabold text-lg text-brand-blue-900 mb-1">Gửi Phản Hồi & Yêu Cầu Hỗ Trợ SMS</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bạn cần hỗ trợ bảo hành đổi trả, đặt đơn đoàn thể hay phản ánh dịch vụ? Vui lòng gửi nhanh biểu mẫu trực tiếp dưới đây.
                  </p>
                </div>

                {careFormSuccess ? (
                  <div className="p-5 bg-green-50 border border-green-100 rounded-2xl space-y-3">
                    <span className="text-3xl">💬</span>
                    <h5 className="font-bold text-green-905 text-sm">Gửi Yêu Cầu Hỗ Trợ Thành Công!</h5>
                    <p className="text-xs text-green-800 leading-relaxed">
                      Cảm ơn bạn đã tin tưởng Gnod Food. Ban chăm sóc khách hách đã ghi nhận dữ liệu cứu trợ của bạn. Chuyên viên sẽ gọi điện thoại hoặc gửi Zalo hỗ trợ trong 10 phút.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCareSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Họ tên của bạn *</label>
                      <input
                        name="careName"
                        type="text"
                        placeholder="Nộp thông tin liên hệ"
                        required
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-brand-blue-900 focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Số điện thoại *</label>
                        <input
                          name="carePhone"
                          type="tel"
                          placeholder="Số ĐT tiếp nhận"
                          required
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-brand-blue-900 focus:outline-none focus:border-[#0070f3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Email liên lạc (Nếu có)</label>
                        <input
                          name="careEmail"
                          type="email"
                          placeholder="nhapsodo@gmail.com"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-brand-blue-900 focus:outline-none focus:border-[#0070f3]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Nội dung yêu cầu / Feedback chi tiết *</label>
                      <textarea
                        name="careMessage"
                        rows={3}
                        placeholder="Tôi muốn yêu cầu hỗ trợ về đơn hàng/muốn tư vấn thêm..."
                        required
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-brand-blue-900 focus:outline-none focus:border-[#0070f3] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white py-3 rounded-xl font-display font-medium text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>GỬI PHẢN HỒI</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 7: TUYỂN DỤNG & CƠ HỘI ĐỒNG HÀNH (CAREERS) */}
      {/* ──────────────────────────────────────────────────────── */}
      <section id="careers" className="py-20 bg-slate-50 border-b border-brand-blue-100/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#0070f3] text-xs uppercase tracking-widest font-extrabold font-display block">GIA NHẬP ĐẠI GIA ĐÌNH GNOD FOOD</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-blue-900 tracking-tight">
              Cơ Hội Nghề Nghiệp & Đồng Hành Việt
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Bạn có chung niềm đam mê gìn giữ ẩm thực gốc, muốn giới thiệu những sản phẩm sạch thuần khiết đến tay người tiêu dùng sành ăn toàn quốc? Cùng Gnod vẽ nên chương trình phát triển bùng nổ!
            </p>
            <div className="w-12 h-1 bg-[#0070f3] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CAREER_OPPORTUNITIES.map((job) => (
              <div 
                key={job.id} 
                className="bg-white border border-[#e2eaf2] rounded-3xl p-8 hover:shadow-xl hover:border-[#a1e2ff] transition-all duration-300 relative overflow-hidden flex flex-col justify-between whitespace-normal text-left"
              >
                <div className="absolute top-0 right-0 bg-[#0070f3]/10 text-[#0070f3] font-bold text-[10px] uppercase tracking-wide px-4 py-1.5 rounded-bl-2xl">
                  {job.type}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-400">
                    <Briefcase className="w-4 h-4 text-[#0070f3]" />
                    <span className="text-xs font-semibold tracking-wider uppercase">{job.department}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-extrabold text-lg sm:text-xl text-brand-blue-900 leading-tight">
                      {job.title}
                    </h3>
                    <div className="text-[#0070f3] font-mono text-xs font-bold mt-1">
                      {job.salary}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {job.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="block text-[10.5px] font-bold text-brand-blue-800 uppercase tracking-widest">Yêu Cầu Công Việc:</span>
                    <ul className="space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="flex items-start text-xs text-slate-500 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-[#0070f3] mr-1.5 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>

                  <button
                    onClick={() => setApplyingJob(job)}
                    className="py-2.5 px-5 bg-brand-blue-900 hover:bg-[#0070f3] text-white rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-colors cursor-pointer shadow-sm hover:shadow"
                  >
                    Ứng tuyển ngay
                  </button>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>





      {/* ──────────────────────────────────────────────────────── */}
      {/* SECTION 8: FOOTER METRICS & SOCIAL BRAND CARDS */}
      {/* ──────────────────────────────────────────────────────── */}
      <footer className="bg-brand-blue-900 text-[#cbd5e1] py-16 border-t border-brand-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            
            {/* Logo area */}
            <div className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shadow-sm">
              <GnodLogo className="w-10 h-10" />
              <span className="font-display font-extrabold text-xl tracking-widest text-white">
                GNOD FOOD
              </span>
            </div>

            {/* Information Grid/Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-slate-300 font-medium">
              
              <a 
                href="tel:0793754195" 
                className="flex items-center space-x-3 bg-white/5 hover:bg-[#0070f3]/25 hover:text-white px-5 py-3 rounded-xl border border-white/10 transition-colors cursor-pointer group"
              >
                <Phone className="w-5 h-5 text-[#0070f3] group-hover:scale-110 transition-transform" />
                <span className="tracking-wide">Hotline/Zalo: <strong className="text-white text-base">079 375 4195</strong></span>
              </a>

              <div className="flex items-center space-x-3 bg-white/5 px-5 py-3 rounded-xl border border-white/10">
                <Clock className="w-5 h-5 text-[#00a3ff]" />
                <span className="tracking-wide">Thời gian làm việc: <strong className="text-white">9:00 AM - 18:00PM</strong></span>
              </div>

            </div>

            {/* Social Media Channels */}
            <div id="footer-social-section" className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                id="btn-social-tiktok"
                href="https://www.tiktok.com/@gnodfood?_r=1&_t=ZS-96n3kU95xlU"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 bg-white/5 hover:bg-black hover:text-white hover:border-white/30 px-5 py-2.5 rounded-xl border border-white/15 transition-all cursor-pointer group shadow-sm text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                <svg className="w-4 h-4 text-[#25f4ee] group-hover:animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.22-.4-.47-.58-.73v7.24c.01 5.26-4.27 9.52-9.52 9.52-5.26-.01-9.52-4.29-9.51-9.55C-.11 9.38 4.25 5.08 9.55 5.1c0 1.34-.01 2.68-.01 4.02-3.01-.13-5.56 2.13-5.71 5.14-.17 3.29 2.44 6.13 5.73 6.15 3.19.02 5.86-2.5 5.92-5.69.02-4.9-.01-9.8-.01-14.7z" />
                </svg>
                <span>TikTok</span>
              </a>

              <a
                id="btn-social-facebook"
                href="https://www.facebook.com/share/14XrZY1ZVLU/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 bg-white/5 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]/50 px-5 py-2.5 rounded-xl border border-white/15 transition-all cursor-pointer group shadow-sm text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                <svg className="w-4 h-4 text-[#1877F2] group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                id="btn-social-instagram"
                href="https://www.instagram.com/khohaisan_gnodfood?igsh=Y2tiendseWN2ZzZj&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2.5 bg-white/5 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent px-5 py-2.5 rounded-xl border border-white/15 transition-all cursor-pointer group shadow-sm text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                <svg className="w-4 h-4 text-[#ee2a7b] group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>Instagram</span>
              </a>
            </div>

            {/* Minimal Copyright */}
            <div className="text-[11px] text-slate-500 pt-4">
              © {new Date().getFullYear()} Gnod Food. Nơi hương vị nguyên bản của đại dương gặp gỡ sự chuẩn mực.
            </div>

          </div>
        </div>
      </footer>

      {/* ──────────────────────────────────────────────────────── */}
      {/* INTERACTIVE COMPONENT A: PRODUCT DETAILS DIALOGUE */}
      {/* ──────────────────────────────────────────────────────── */}
      {selectedProductDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-brand-blue-100 overflow-hidden shadow-2xl relative">
            
            {/* Header info */}
            <div className="bg-brand-blue-50/50 p-6 border-b border-brand-blue-100 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#0070f3] font-extrabold block">Bảng công nghệ sản phẩm Gnod</span>
                <h3 className="font-display font-extrabold text-xl text-brand-blue-900 mt-1">
                  {selectedProductDetails.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-brand-blue-900 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Spec Body container */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Simple row view */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                
                {/* Visual */}
                <div className="aspect-[4/3] rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative">
                  <img
                    src={selectedProductDetails.image}
                    alt={selectedProductDetails.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Spec details list */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-brand-blue-900 uppercase tracking-widest mb-2 border-b border-slate-50 pb-1">
                    Thông số kiểm định
                  </h4>
                  <table className="w-full text-xs text-left text-slate-600 border-collapse">
                    <tbody>
                      {selectedProductDetails.specs.map((item, i) => (
                        <tr key={i} className="border-b border-slate-100 pb-2">
                          <td className="py-2.5 font-bold text-brand-blue-900 pr-4">{item.label}</td>
                          <td className="py-2.5 text-slate-500">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Extended descriptions and lists */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-brand-blue-900 uppercase tracking-widest border-b border-slate-50 pb-1">
                  Mô tả quy trình thu tuyển & Phơi lưới
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedProductDetails.description}
                </p>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                  <span className="block text-xs font-bold text-brand-blue-800">Cam kết vàng 5 sao:</span>
                  <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-500">
                    {selectedProductDetails.details.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dynamic order pricing calculator */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <span className="text-xs font-extrabold text-brand-blue-900 uppercase tracking-wide">Số lượng đặt:</span>
                  <div className="flex items-center space-x-1.5 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                    <button
                      onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-bold text-brand-blue-900 w-8 text-center">{orderQuantity}</span>
                    <button
                      onClick={() => setOrderQuantity(orderQuantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Tổng nguyên khoán:</span>
                  <p className="font-display font-extrabold text-xl text-brand-blue-900">
                    {calculateTotalPrice(selectedProductDetails.price, orderQuantity)}
                  </p>
                </div>
              </div>

            </div>

            {/* Footer triggers */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end space-x-2.5 sm:space-x-3">
              <button
                onClick={() => setSelectedProductDetails(null)}
                className="py-2.5 px-4 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold tracking-tight font-display transition-colors cursor-pointer"
              >
                Đóng lại
              </button>
              <button
                onClick={() => {
                  handleAddToCart(selectedProductDetails, orderQuantity);
                  setSelectedProductDetails(null);
                }}
                className="py-2.5 px-4 bg-[#e6f4fe] hover:bg-brand-blue-100 text-[#0070f3] rounded-xl text-xs font-bold tracking-tight font-display transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Thêm vào giỏ</span>
              </button>
              <button
                onClick={() => {
                  setQuickOrderProduct(selectedProductDetails);
                  setQuickOrderQty(orderQuantity);
                  setSelectedProductDetails(null);
                  setIsQuickOrderOpen(true);
                }}
                className="py-2.5 px-5 bg-brand-blue-900 hover:bg-[#0070f3] text-white rounded-xl text-xs font-bold tracking-wider font-display transition-colors cursor-pointer shadow-sm"
              >
                Đặt mua nhanh hỏa tốc
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* INTERACTIVE COMPONENT B: QUICK ONE-CLICK ORDER MODAL */}
      {/* ──────────────────────────────────────────────────────── */}
      {isQuickOrderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md border border-brand-blue-100 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsQuickOrderOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0070f3] flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-2 text-[#0070f3] mb-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: "5s" }} />
                <span className="text-xs uppercase tracking-widest font-extrabold font-display">Mở đơn 1-Click hỏa tốc</span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-brand-blue-900 mb-4">
                Mua Nhanh: {quickOrderProduct.name}
              </h3>

              {successOrderMsg ? (
                <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-xs text-green-850 space-y-3">
                  <span className="text-2xl">📦</span>
                  <p className="font-semibold leading-relaxed">{successOrderMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleQuickOrderSubmit} className="space-y-4">
                  {/* Select product preview pricing dynamic panel */}
                  <div className="p-3 bg-brand-sand rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">Sản phẩm chọn mua:</span>
                      <p className="font-bold text-xs text-brand-blue-900">{quickOrderProduct.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Tổng giá:</span>
                      <span className="font-extrabold text-sm text-[#0070f3] font-mono">
                        {calculateTotalPrice(quickOrderProduct.price, quickOrderQty)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-blue-900 uppercase">Số lượng đặt:</span>
                    <div className="flex items-center space-x-1 border border-slate-200 rounded-lg bg-white p-1">
                      <button
                        type="button"
                        onClick={() => setQuickOrderQty(Math.max(1, quickOrderQty - 1))}
                        className="w-6 h-6 rounded bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer font-bold"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono">{quickOrderQty}</span>
                      <button
                        type="button"
                        onClick={() => setQuickOrderQty(quickOrderQty + 1)}
                        className="w-6 h-6 rounded bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-xs cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Simple text inputs */}
                  <div>
                    <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Tên của bạn *</label>
                    <input
                      name="quickName"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      required
                      className="w-full px-4.5 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-sm text-brand-blue-900 focus:outline-none focus:border-[#0070f3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Số điện thoại giao hàng *</label>
                    <input
                      name="quickPhone"
                      type="tel"
                      placeholder="Số di động nhịn máy"
                      required
                      className="w-full px-4.5 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-sm text-brand-blue-900 focus:outline-none focus:border-[#0070f3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Địa chỉ nhận hàng (Không bắt buộc)</label>
                    <input
                      name="quickAddress"
                      type="text"
                      placeholder="VD: số 12 Trương Định, Q3, TPHCM"
                      className="w-full px-4.5 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-sm text-brand-blue-900 focus:outline-none focus:border-[#0070f3]"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 italic leading-relaxed">
                    * Nhấn xác nhận đặt mua đồng nghĩa quý khách đồng ý chia sẻ thông tin sđt để nhân viên của Gnod hỗ trợ gác hộp bưu tá trong tích tắc.
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsQuickOrderOpen(false)}
                      className="flex-1 py-3 text-slate-500 hover:bg-slate-100 text-xs font-bold uppercase rounded-xl transition-all font-display cursor-pointer"
                    >
                      Bỏ qua
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brand-blue-900 hover:bg-[#0070f3] text-white font-display text-xs font-bold uppercase tracking-wide py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Xác nhận đặt ngay
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* INTERACTIVE COMPONENT C: CAREERS RECRUITMENT APPLY MODAL */}
      {/* ──────────────────────────────────────────────────────── */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg border border-brand-blue-100 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => {
                setApplyingJob(null);
                setCareerFormSuccess(null);
                setAttachedFileName(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-[#0070f3] flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center space-x-2 text-[#0070f3] mb-2 font-display uppercase tracking-widest text-xs font-black">
                <Briefcase className="w-5 h-5 text-[#0070f3]" />
                <span>Nộp đơn ứng tuyển trực tiếp</span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-brand-blue-900 mb-2 leading-tight">
                Ứng tuyển vị trí: {applyingJob.title}
              </h3>
              <p className="text-xs text-[#0070f3] font-bold font-mono tracking-wide bg-[#e6f4fe] px-3 py-1 rounded inline-block mb-4">
                {applyingJob.salary}
              </p>

              {careerFormSuccess ? (
                <div className="p-5 bg-green-50 border border-green-100 rounded-2xl text-xs text-green-800 space-y-3">
                  <span className="text-3xl">🎉</span>
                  <p className="font-semibold leading-relaxed">{careerFormSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleCareerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Họ tên của bạn *</label>
                      <input
                        name="candidateName"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        required
                        className="w-full px-4 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Số điện thoại liên hệ *</label>
                      <input
                        name="candidatePhone"
                        type="tel"
                        placeholder="Số di động của bạn"
                        required
                        className="w-full px-4 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Email cá nhân *</label>
                      <input
                        name="candidateEmail"
                        type="email"
                        placeholder="email@example.com"
                        required
                        className="w-full px-4 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Link truyền thông (FB / Zalo / LinkedIn) *</label>
                      <input
                        name="candidateProfile"
                        type="text"
                        placeholder="facebook.com/..., linkedin.com/..."
                        required
                        className="w-full px-4 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0070f3]"
                      />
                    </div>
                  </div>

                  {/* Drag and Drop simulate cv upload box */}
                  <div>
                    <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Đính kèm Hồ sơ năng lực (CV / Portfolio) *</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-[#0070f3] rounded-2xl p-4 text-center cursor-pointer relative bg-brand-sand transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileDropChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required={!attachedFileName}
                      />
                      <div className="space-y-1">
                        <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                        <p className="text-xs font-semibold text-brand-blue-900">
                          {attachedFileName ? (
                            <span className="text-green-600 flex items-center justify-center gap-1.5 font-bold">
                              <FileText className="w-3.5 h-3.5" />
                              {attachedFileName}
                            </span>
                          ) : (
                            "Kéo thả hoặc Nhấp để đính kèm file CV (.pdf, .doc)"
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">Dung lượng tối đa: 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Lời tự giới thiệu ngắn (Kinh nghiệm nổi bật)</label>
                    <textarea
                      name="candidateIntro"
                      rows={3}
                      placeholder="Chia sẻ ngắn gọn động lực của bạn..."
                      className="w-full px-4 py-2.5 bg-brand-sand border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#0070f3] resize-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setApplyingJob(null);
                        setCareerFormSuccess(null);
                        setAttachedFileName(null);
                      }}
                      className="flex-1 py-3 text-slate-500 hover:bg-slate-100 text-xs font-bold uppercase rounded-xl transition-all font-display cursor-pointer"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brand-blue-900 hover:bg-[#0070f3] text-white text-xs font-bold uppercase tracking-wide py-3 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Nộp hồ sơ ngay
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Floating Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Floating Customer Account Profile & Orders Drawer */}
      <AccountDrawer
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />

      {/* Floating AI Chatbot Assistant */}
      <AIChatbot />

    </div>
  );
}
