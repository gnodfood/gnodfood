import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  LogIn, 
  LogOut, 
  X, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  MapPin, 
  Phone,
  Compass,
  Gift,
  Plus,
  RefreshCw
} from "lucide-react";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  getDocs
} from "firebase/firestore";
import { auth, db, googleProvider, OperationType, handleFirestoreError } from "../lib/firebase";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderRecord {
  id: string;
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  deliveryMethod: string;
  items: Array<{
    name: string;
    price: string;
    quantity: number;
    unit: string;
  }>;
  totalAmount: number;
  shippingFee: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: any;
  notes?: string;
}

export default function AccountDrawer({ isOpen, onClose }: AccountDrawerProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        setEditedName(currentUser.displayName || "");
        // Save or verify user profile in database
        await syncUserProfile(currentUser);
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Monitor User Orders using Real-time Snapshots (Secure list query enforcer check)
  useEffect(() => {
    if (!user) return;
    
    setLoadingOrders(true);
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef, 
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderList: OrderRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          orderList.push({
            id: docSnap.id,
            ...data,
          } as OrderRecord);
        });
        setOrders(orderList);
        setLoadingOrders(false);
      },
      (error) => {
        // Enforces specific handles on Firebase permissions failure
        handleFirestoreError(error, OperationType.LIST, "orders");
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Handle outside body scroll locks
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

  // Synchronise or create customer profiles
  const syncUserProfile = async (firebaseUser: FirebaseUser) => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        // Bootstrap fresh metadata record
        await setDoc(userDocRef, {
          userId: firebaseUser.uid,
          displayName: firebaseUser.displayName || "Khách Hàng Thân Thiết",
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
    }
  };

  // Update customer name profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editedName.trim() || updatingProfile) return;

    setUpdatingProfile(true);
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, {
        displayName: editedName.trim(),
        updatedAt: Timestamp.now()
      });
      setIsEditingName(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      alert("Đăng nhập bằng tài khoản Google không thành công: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      alert("Đóng phiên đăng nhập thất bại: " + error.message);
    }
  };

  // Cancel order (status shifts to cancelled only if pending)
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Quý khách có chắc chắn muốn hủy đơn hàng này không?")) return;

    const orderDocRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderDocRef, {
        status: "cancelled",
        updatedAt: Timestamp.now()
      });
      alert("Đã gửi yêu cầu hủy đơn hàng thành công!");
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const formatPrice = (amount: number): string => {
    return amount.toLocaleString("vi-VN") + " VND";
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ duyệt tiếp nhận", class: "bg-amber-50 text-amber-700 border border-amber-200" };
      case "confirmed":
        return { label: "Đã nấu / Giao hàng", class: "bg-blue-50 text-blue-700 border border-blue-200" };
      case "completed":
        return { label: "Giao thành công 🍽️", class: "bg-emerald-50 text-emerald-700 border border-emerald-200" };
      case "cancelled":
        return { label: "Đã hủy đơn", class: "bg-slate-100 text-slate-500 border border-slate-200" };
      default:
        return { label: "Chào đón", class: "bg-slate-100 text-slate-700 border border-slate-200" };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer pointer-events-auto"
            onClick={onClose}
          />

          {/* Account Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:max-w-md bg-white border-l border-brand-blue-100 shadow-2xl z-50 flex flex-col pointer-events-auto text-left"
          >
            {/* Header branding */}
            <div className="bg-brand-blue-900 text-white px-6 py-5 flex items-center justify-between relative shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-950 to-brand-blue-900 pointer-events-none" />
              <div className="flex items-center space-x-2.5 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#a3e3fc] shadow-inner">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base tracking-tight">Thành Viên Gnod Sạch</h3>
                  <p className="text-[10px] text-slate-300">Khám phá vạn quà biển ngọt</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors relative z-10"
              >
                ✕
              </button>
            </div>

            {/* Scrolling account dashboard body */}
            <div className="flex-1 overflow-y-auto bg-brand-sand/30 p-5 scrollbar-thin">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-2">
                  <RefreshCw className="w-8 h-8 text-[#0070f3] animate-spin" />
                  <p className="text-slate-500 text-xs font-medium">Đang đối chiếu tài khoản...</p>
                </div>
              ) : !user ? (
                /* GUEST LOGIN VIEW */
                <div className="space-y-6">
                  {/* Privilege Promo Visual */}
                  <div className="bg-gradient-to-tr from-[#f0f8ff] to-[#e6f4fe] border border-brand-blue-100/70 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0070f3]/10 flex items-center justify-center text-[#0070f3]">
                        <Gift className="w-4.5 h-4.5" />
                      </div>
                      <h4 className="font-display font-extrabold text-brand-blue-900 text-sm tracking-tight uppercase">Đặc Quyền Hội Viên Gnod</h4>
                    </div>

                    <div className="space-y-3 pl-1">
                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 text-xs font-bold font-mono bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <div>
                          <p className="text-xs font-bold text-brand-blue-950">Theo dõi hành trình đơn hàng</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Xem lịch lịch sử, tra cứu hành lý hỏa tốc 2 giờ hoặc kiểm tra sấy khô.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 text-xs font-bold font-mono bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <div>
                          <p className="text-xs font-bold text-brand-blue-950">Bảo hành Vàng 7 ngày</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Yêu cầu hoàn trả, gửi đổi hũ hôi dầu mốc từ xa không cần giấy thủ tục rườm rà.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <span className="w-5 h-5 text-xs font-bold font-mono bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <div>
                          <p className="text-xs font-bold text-brand-blue-950">Tích lũy điểm Gnod Hải Sản</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">Đổi quà tôm đất hột sấy nhạt muối hoặc khô đuối sụn mắm me đậm vị cho lần nhậu kế tiếp.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sign In Prompt Action */}
                  <div className="space-y-4 text-center">
                    <div className="space-y-2">
                      <h3 className="font-display font-extrabold text-[#021a30] text-sm">Gia Nhập Gia Đình Gnod Food Sạch Ngay</h3>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                        Xác thực nhanh bằng Tài khoản Google của bạn. An toàn, tức thì, bảo mật tuyệt đối 100%.
                      </p>
                    </div>

                    <button
                      onClick={handleLogin}
                      className="w-full flex items-center justify-center space-x-3 bg-brand-blue-900 hover:bg-[#0070f3] text-white py-3 px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-[#a3e3fc]" />
                      <span>Đăng nhập với Google</span>
                    </button>
                    
                    <div className="flex items-center justify-center space-x-1.5 text-[10.5px] text-slate-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                      <span>Firebase Secure Authentication API</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* CUSTOMER DASHBOARD VIEW */
                <div className="space-y-6">
                  {/* Profile Summary Card */}
                  <div className="bg-white rounded-2xl p-4 border border-brand-blue-100 shadow-sm flex items-center space-x-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-full bg-[#e6f4fe]/50 rounded-l-full pointer-events-none" />
                    <img 
                      src={user.photoURL || "/assets/images/user-default.png"} 
                      alt={user.displayName || "Thành viên"}
                      className="w-12 h-12 rounded-full border-2 border-brand-blue-100/50 object-cover relative z-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'Gnod'}`;
                      }}
                    />
                    <div className="flex-1 min-w-0 relative z-10">
                      {isEditingName ? (
                        <form onSubmit={handleUpdateProfile} className="flex gap-1.5 items-center mt-1">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="bg-slate-50 border border-slate-200 focus:border-[#0070f3] rounded-lg px-2.5 py-1 text-xs focus:outline-none text-slate-800 w-32"
                            disabled={updatingProfile}
                            required
                          />
                          <button
                            type="submit"
                            title="Lưu"
                            className="px-2 py-1 bg-brand-blue-900 text-white rounded-md text-[10px] uppercase font-bold cursor-pointer hover:bg-[#0070f3]"
                            disabled={updatingProfile}
                          >
                            Lưu
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingName(false)}
                            className="px-1.5 py-1 text-slate-500 hover:text-slate-800 text-[10px] uppercase font-semibold cursor-pointer"
                          >
                            Hủy
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <h4 className="font-display font-extrabold text-xs text-brand-blue-900 truncate">
                            {user.displayName || "Thành viên Gnod"}
                          </h4>
                          <button 
                            onClick={() => {
                              setEditedName(user.displayName || "");
                              setIsEditingName(true);
                            }}
                            className="text-[10px] text-[#0070f3] hover:underline cursor-pointer"
                          >
                            Sửa
                          </button>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  {/* Order History Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <FileText className="w-4 h-4 text-[#0070f3]" />
                        <h4 className="font-display font-extrabold text-xs tracking-wider uppercase text-brand-blue-950">Lịch Sử Đặt Giao</h4>
                      </div>
                      <span className="font-mono text-[10.5px] font-bold bg-white px-2 py-0.5 border border-brand-blue-100 text-[#0070f3] rounded-md">
                        {orders.length} Đơn đặt
                      </span>
                    </div>

                    {loadingOrders ? (
                      <div className="bg-white/60 rounded-2xl py-12 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center space-y-2">
                        <RefreshCw className="w-5 h-5 text-slate-400 animate-spin" />
                        <p className="text-[10.5px] text-slate-400">Đang đồng bộ đơn...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="bg-white/60 rounded-2xl py-12 border border-dashed border-slate-200 text-center px-4">
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Bạn chưa đặt mua bất kỳ đơn đặc sản nào trên tài khoản này.</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Đơn đặt từ giỏ hàng sẽ tự hiển thị hành lý giao tại vị trí này ngay lập tức!</p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {orders.map((ord) => {
                          const statusState = getOrderStatusText(ord.status);
                          let dateLabel = "Đặt gần đây";
                          if (ord.createdAt) {
                            try {
                              const date = ord.createdAt.toDate ? ord.createdAt.toDate() : new Date(ord.createdAt);
                              dateLabel = date.toLocaleDateString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "short",
                              });
                            } catch {
                              dateLabel = "Hôm nay";
                            }
                          }

                          return (
                            <div 
                              key={ord.id}
                              className="bg-white rounded-2xl border border-brand-blue-100 shadow-sm overflow-hidden"
                            >
                              {/* Order Card Sub-header */}
                              <div className="bg-slate-50/70 p-3 border-b border-slate-100 flex justify-between items-center text-xs">
                                <div className="space-y-0.5">
                                  <span className="font-bold text-brand-blue-900 font-mono text-[11px] block">{ord.orderId}</span>
                                  <span className="text-[9.5px] text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{dateLabel}</span>
                                  </span>
                                </div>
                                <span className={`text-[10px] font-bold py-1 px-2.5 rounded-full ${statusState.class}`}>
                                  {statusState.label}
                                </span>
                              </div>

                              {/* Order Card Product item list summary */}
                              <div className="p-3.5 space-y-3.5 text-xs text-slate-600">
                                <div className="space-y-1.5 divide-y divide-slate-100/50">
                                  {ord.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center pt-1.5 first:pt-0">
                                      <span className="truncate max-w-[200px] text-brand-blue-950 font-medium">{item.name}</span>
                                      <span className="font-bold font-mono text-slate-700">x{item.quantity} - {formatPrice((parseInt(item.price.replace(/\./g, ""), 10) || 0) * item.quantity)}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Destination delivery info logs */}
                                <div className="bg-brand-sand/20 rounded-xl p-2.5 space-y-1.5 border border-slate-50">
                                  <div className="flex items-start gap-1 text-[10.5px]">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2 text-slate-500 leading-snug">Địa chỉ: {ord.shippingAddress} (nhận bởi {ord.recipientName} - {ord.recipientPhone})</span>
                                  </div>
                                  {ord.notes && (
                                    <div className="flex items-start gap-1 text-[10px] text-[#0070f3] bg-[#e6f4fe]/40 px-2 py-1 rounded">
                                      <span>*Ghi chú: {ord.notes}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-between items-end border-t border-slate-100/80 pt-3">
                                  {ord.status === "pending" ? (
                                    <button
                                      onClick={() => handleCancelOrder(ord.id)}
                                      className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 border border-red-100 rounded-lg cursor-pointer transition-colors"
                                    >
                                      Hủy Đơn Hàng
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                                      <span>Phiên bảo vệ</span>
                                    </div>
                                  )}

                                  <div className="text-right">
                                    <span className="text-[10.5px] text-slate-400 block pb-0.5">Cộng thanh toán:</span>
                                    <span className="font-display font-black text-[#021a30] font-mono text-[13.5px]">
                                      {formatPrice(ord.totalAmount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Sign Out Action Button */}
                  <div className="pt-6 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-1.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-55/10 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 shrink-0" />
                      <span>Đăng xuất Tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
