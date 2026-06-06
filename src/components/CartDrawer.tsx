import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ShieldCheck,
  Truck, 
  CheckCircle,
  Phone,
  Gift,
  Coins
} from "lucide-react";
import { CartItem } from "../types";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db, OperationType, handleFirestoreError } from "../lib/firebase";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    deliveryMethod: "standard" // standard or express
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("cart");
    }
  }, [isOpen]);

  // Handle outside click to close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Numerical parser
  const getPriceNumber = (priceStr: string): number => {
    return parseInt(priceStr.replace(/\./g, ""), 10);
  };

  const calculateItemSubtotal = (priceStr: string, qty: number): number => {
    return getPriceNumber(priceStr) * qty;
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((acc, item) => acc + calculateItemSubtotal(item.price, item.quantity), 0);
  };

  // 15k for standard, 35k for express hỏa tốc. Free ship standard over 500k!
  const getShippingFee = (): number => {
    const total = calculateTotal();
    if (formData.deliveryMethod === "express") return 35000;
    if (total >= 500000) return 0;
    return 20000;
  };

  const formatPrice = (amount: number): string => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      alert("Vui lòng nhập đầy đủ các thông tin bắt buộc (*)");
      return;
    }

    setIsLoading(true);

    const productsSummary = cartItems
      .map((item) => `${item.quantity} x ${item.name} (${item.unit || "hũ 250g"})`)
      .join(", ");

    const totalBill = calculateTotal() + getShippingFee();
    const mockOrderId = "GNOD-" + Math.floor(100000 + Math.random() * 900000);

    const message = `[ĐƠN HÀNG MỚI từ Giỏ Hàng] Mã đơn: ${mockOrderId}
Danh sách: ${productsSummary}
Tổng tiền sản phẩm: ${formatPrice(calculateTotal())}
Phí vận chuyển: ${formatPrice(getShippingFee())} (${formData.deliveryMethod === "express" ? "Hỏa tốc 2H" : "Giao tiêu chuẩn"})
Nơi giao: ${formData.address}
Ghi chú: ${formData.notes || "Không có"}`;

    // Concurrently write to Firebase Firestore if the user is authenticated
    if (auth.currentUser) {
      try {
        const orderDocRef = doc(db, "orders", mockOrderId);
        await setDoc(orderDocRef, {
          orderId: mockOrderId,
          ownerId: auth.currentUser.uid,
          recipientName: formData.name,
          recipientPhone: formData.phone,
          shippingAddress: formData.address,
          deliveryMethod: formData.deliveryMethod,
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            unit: item.unit
          })),
          totalAmount: totalBill,
          shippingFee: getShippingFee(),
          notes: formData.notes || "",
          status: "pending",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      } catch (err: any) {
        handleFirestoreError(err, OperationType.CREATE, `orders/${mockOrderId}`);
      }
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: "",
          message: message,
          interest: `Đặt hàng Giỏ Hàng (${mockOrderId})`
        })
      });

      if (response.ok) {
        setOrderId(mockOrderId);
        setStep("success");
        onClearCart();
      } else {
        throw new Error("Lỗi máy chủ ghi nhận đơn hàng");
      }
    } catch (err: any) {
      alert("Đặt hàng không thành công: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getSubtotalCount = (): number => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlayer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer pointer-events-auto"
            onClick={onClose}
          />

          {/* Drawer Panel Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-white border-l border-brand-blue-100 shadow-2xl z-50 flex flex-col pointer-events-auto"
          >
            {/* Header section with theme context */}
            <div className="bg-brand-blue-900 text-white px-6 py-5 flex items-center justify-between relative shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-950 to-brand-blue-900 pointer-events-none" />
              <div className="flex items-center space-x-2.5 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3e3fc] shadow-inner">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base tracking-tight">Giỏ Hàng Gnod Sạch</h3>
                  <p className="text-[10px] text-slate-300">Cam kết vàng ăn an lành 100%</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors relative z-10"
              >
                ✕
              </button>
            </div>

            {/* Scrolling Core Content Pane */}
            <div className="flex-1 overflow-y-auto bg-brand-sand/40 p-5 scrollbar-thin">
              {step === "cart" && (
                <>
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 px-4">
                      <div className="w-20 h-20 rounded-full bg-[#e6f4fe] flex items-center justify-center text-[#0070f3] mb-2 animate-bounce" style={{ animationDuration: "3s" }}>
                        <ShoppingBag className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-brand-blue-900 text-base">Giỏ hàng của bạn đang trống</h4>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-xs">
                          Hãy thêm mực khô Phú Quốc, cá đuối nghệ sụn nướng mắm me hay tôm sấy Cà Mau ngọt lịm vào giỏ thưởng thức thôi nào!
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="font-display font-bold text-xs uppercase tracking-wider bg-brand-blue-900 text-white rounded-xl py-3 px-6 hover:bg-[#0070f3] transition-colors focus:outline-none cursor-pointer"
                      >
                        Tiếp Tục Khám Phá Đặc Sản
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Cart Item Row List */}
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white rounded-2xl p-3 border border-brand-blue-100/50 shadow-sm flex items-center space-x-3 transition-all hover:border-[#a3e3fc]"
                          >
                            <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-display font-bold text-xs text-brand-blue-900 truncate leading-snug">
                                {item.name}
                              </h4>
                              <p className="text-[#0070f3] font-extrabold font-mono text-[11.5px] mt-0.5">
                                {item.price} <span className="text-[10px] text-slate-400 font-normal font-sans">/ {item.unit}</span>
                              </p>

                              {/* Quantity Control and Delete */}
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-1 bg-brand-sand/30">
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="w-5 h-5 rounded bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 font-semibold text-xs cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold font-mono text-brand-blue-900">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-5 h-5 rounded bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 font-semibold text-xs cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50/50 cursor-pointer transition-colors"
                                  title="Xóa sản phẩm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Benefits Promo Card */}
                      <div className="bg-gradient-to-tr from-[#f0f8ff] to-[#e6f4fe] border border-brand-blue-100 rounded-2xl p-4 space-y-2.5">
                        <div className="flex items-center space-x-2 text-[#0070f3]">
                          <Gift className="w-4.5 h-4.5 text-[#0070f3]" />
                          <span className="font-display font-extrabold text-xs uppercase tracking-wide">ƯU ĐÃI KHÁCH QUEN</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Đặt mua tôm mực cá chuẩn mộc Gnod Food tại Giỏ Hàng ngay hôm nay sẽ được <strong>bao đổi trả hoàn tiền vô điều kiện trong 7 ngày</strong> nếu mốc ẩm hôi dầu do vận chuyển bưu điện!
                        </p>
                        {calculateTotal() < 500000 ? (
                          <p className="text-[10px] text-brand-blue-950 font-bold bg-white/70 py-1.5 px-3 rounded-lg border border-brand-blue-100">
                            Mua thêm <span className="text-[#0070f3] font-mono">{formatPrice(500000 - calculateTotal())}</span> để nhận ưu đãi <strong>Free Ship Giao Tiêu Chuẩn toàn quốc</strong>.
                          </p>
                        ) : (
                          <p className="text-[10.5px] text-green-700 font-bold bg-green-50 py-1.5 px-3 rounded-lg border border-green-100 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Đơn của bạn đã được ưu đãi <strong>FREE SHIP TIÊU CHUẨN ĐÚNG NGHĨA!</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === "checkout" && (
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-4 border border-brand-blue-100 shadow-sm">
                    <h4 className="font-display font-bold text-xs text-slate-400 uppercase tracking-widest mb-3">Tóm tắt giỏ đặt hàng</h4>
                    <div className="max-h-[140px] overflow-y-auto pr-1 space-y-2 divide-y divide-slate-100">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs text-slate-600 py-1.5">
                          <span className="truncate max-w-[200px] font-medium text-brand-blue-900">{item.name}</span>
                          <span className="font-bold font-mono text-slate-700">x{item.quantity} - {formatPrice(calculateItemSubtotal(item.price, item.quantity))}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-left">
                    <h3 className="font-display font-extrabold text-sm text-brand-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Truck className="w-4.5 h-4.5 text-[#0070f3]" />
                      Thông tin Ship hàng & Thanh Toán
                    </h3>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Họ tên người nhận *</label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Nguyễn Thị C"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Số điện thoại tiếp đơn *</label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Số ĐT tiếp sỉ / nhận hàng"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Địa chỉ giao hàng hỏa tốc/tiện lợi *</label>
                      <textarea
                        name="address"
                        required
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Số 123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3] focus:outline-none resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Phương thức giao hàng</label>
                      <select
                        name="deliveryMethod"
                        value={formData.deliveryMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3] focus:outline-none"
                      >
                        <option value="standard">Giao tiêu chuẩn toàn quốc (Giao hàng 1-3 ngày, đồng kiểm hàng)</option>
                        <option value="express">Giao hỏa tốc 2 giờ nội thành HCM/Vũng Tàu (+35.000 VND)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-brand-blue-900 uppercase mb-1">Ghi chú cho shipper / Yêu cầu thêm (nếu có)</label>
                      <textarea
                        name="notes"
                        rows={2}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Nước xốt mắm me để riêng, hoặc sấy nhạt muối hơn nữa..."
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-[#0070f3] focus:border-[#0070f3] focus:outline-none resize-none"
                      />
                    </div>

                    {/* Quick commitment indicator with safety focus */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-[10px] font-bold text-brand-blue-950 uppercase">THANH TOÁN KHI NHẬN HÀNG (Ship COD)</span>
                        <p className="text-[9.5px] text-slate-500 leading-normal">
                          Gnod tin cây khách hàng nên luôn gửi đồng kiểm, mở nếm kiểm tra đạt chuẩn độ giòn và sạch hoàn toàn mới thanh toán.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white py-3 px-4 rounded-xl font-display font-medium text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Đang gửi đơn hàng..." : "Gửi Đơn Đặt Hàng"}
                      {!isLoading && <ArrowRight className="w-4 h-4 ml-1" />}
                    </button>
                  </form>
                </div>
              )}

              {step === "success" && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 py-20 px-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 animate-pulse">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display font-extrabold text-green-800 text-lg">Đặt đơn thành công!</h4>
                    <p className="text-[#0070f3] font-mono text-xs font-bold tracking-wider uppercase px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg inline-block">
                      Mã đơn: {orderId}
                    </p>
                    <p className="text-slate-600 text-xs leading-relaxed pt-2">
                      Chân thành cảm ơn quý khách đã tin cậy Gnod Food. Đội ngũ chăm sóc sẽ liên hệ hoặc điện thoại/Zalo để xác nhận giao hàng đến bạn trong vòng 10 phút.
                    </p>
                  </div>

                  <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2">
                    <span className="block text-[10.5px] font-bold text-brand-blue-900 uppercase">Liên hệ hỗ trợ hỏa tốc:</span>
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-[#0070f3]" />
                      <span>Tổng đài miễn phí: <strong>079 375 4195</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 bg-brand-blue-900 hover:bg-[#0070f3] text-white rounded-xl text-xs font-bold uppercase tracking-wider font-display transition-colors cursor-pointer shadow-sm"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              )}
            </div>

            {/* Static footer with calculations (only on cart/checkout steps) */}
            {step !== "success" && cartItems.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-100 p-5 space-y-3.5 relative z-10">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tổng sản phẩm ({getSubtotalCount()} món):</span>
                    <span className="font-bold font-mono text-slate-800">{formatPrice(calculateTotal())}</span>
                  </div>

                  {step === "checkout" && (
                    <div className="flex justify-between border-t border-slate-100/60 pt-1.5">
                      <span>Phí vận chuyển ({formData.deliveryMethod === "express" ? "Hỏa tốc" : "Chuẩn"}):</span>
                      <span className="font-bold font-mono text-slate-800">
                        {getShippingFee() === 0 ? "MIỄN PHÍ" : formatPrice(getShippingFee())}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between border-t border-slate-200 pt-2.5 items-end">
                    <span className="font-bold text-slate-800 text-sm">Cộng tổng đơn thanh toán:</span>
                    <span className="font-display font-extrabold text-lg text-brand-blue-900 font-mono">
                      {formatPrice(calculateTotal() + (step === "checkout" ? getShippingFee() : 0))}
                    </span>
                  </div>
                </div>

                {step === "cart" && (
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full flex items-center justify-center space-x-2 bg-brand-blue-900 hover:bg-[#0070f3] text-white py-3 px-4 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                  >
                    <span>Tiến Hành Đặt Hàng</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
