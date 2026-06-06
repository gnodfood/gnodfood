import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquareCode, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  RotateCcw, 
  Check, 
  Waves,
  ArrowRight
} from "lucide-react";

interface Message {
  sender: "user" | "bot" | "system";
  text: string;
  time: string;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Xin chào quý khách! Tôi là **Trợ lý ảo Gnod AI**. 🌊\nTôi rất vui được đồng hành cùng bạn tìm hiểu về các cực phẩm khô hải sản sạch của đại gia đình **Gnod Food**.\n\nBạn có thắc mắc gì về sản phẩm, chính sách bảo hành 7 ngày hay sỉ & tuyển dụng không ạ?",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick replies for easy interaction
  const QUICK_SUGGESTIONS = [
    "Mực khô vỉa cát Phú Quốc có gì đặc sắc?",
    "Ăn khô đuôi nghệ sụn xốt mắm me sao cho ngon?",
    "Chính sách đổi trả vàng 7 ngày là gì?",
    "Thông tin sỉ đối tác & Tuyển dụng Trưởng phân phối?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 200);
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { sender: "user", text: textToSend, time: userTime };
    
    // Add user message to stack
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối đến máy chủ Gnod AI");
      }

      const data = await response.json();
      const botTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply,
          time: botTime,
        },
      ]);
    } catch (error: any) {
      const errorTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Dạ, hệ thống kết nối AI của Gnod đang bận điều tiết một chút. Bạn có thể gửi lại câu hỏi hoặc gọi trực tiếp SĐT Chăm sóc khách hàng của chúng tôi nhé! Chân thành cảm ơn bạn.",
          time: errorTime,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    const time = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setMessages([
      {
        sender: "bot",
        text: "Dạ, cuộc trò chuyện hỏi đáp đã được đặt lại. Tôi có thể hỗ trợ quý khách tìm hiểu thêm món gì hôm nay ạ? 🌊",
        time,
      },
    ]);
  };

  // Safe and clean text formatting for typical gnod bot markup
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Gạch đầu dòng
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <div key={idx} className="flex items-start gap-1 px-1 my-0.5 ml-2">
            <span className="text-[#0070f3] font-bold mt-1 text-[9px]">•</span>
            <span className="text-xs leading-relaxed text-slate-700">
              {formatInlineStyles(trimmed.substring(2))}
            </span>
          </div>
        );
      }

      // Danh mục số
      if (/^\d+\.\s/.test(trimmed)) {
        const indexMatch = trimmed.match(/^(\d+)\.\s(.*)/);
        if (indexMatch) {
          return (
            <div key={idx} className="flex items-start gap-1 px-1 my-0.5 ml-2">
              <span className="text-[#0070f3] font-mono text-xs font-bold">{indexMatch[1]}.</span>
              <span className="text-xs leading-relaxed text-slate-700">
                {formatInlineStyles(indexMatch[2])}
              </span>
            </div>
          );
        }
      }

      return (
        <p key={idx} className="text-xs leading-relaxed text-slate-700 my-1">
          {formatInlineStyles(trimmed)}
        </p>
      );
    });
  };

  // Convert **text** to bold tags
  const formatInlineStyles = (txt: string) => {
    const parts = txt.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold text-brand-blue-900 bg-[#e6f4fe]/60 px-1 rounded">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="gnod-ai-fab"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center justify-center p-4 rounded-full bg-brand-blue-900 hover:bg-[#0070f3] text-white shadow-2xl transition-all duration-300 pointer-events-auto cursor-pointer focus:outline-none`}
        >
          {/* Subtle glowing ring */}
          <span className="absolute -inset-1 rounded-full bg-[#0070f3]/30 blur-md opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse pointer-events-none" />
          
          {isOpen ? (
            <X className="w-6 h-6 relative z-10 transition-transform duration-300 rotate-180" />
          ) : (
            <MessageSquareCode className="w-6 h-6 relative z-10 transition-all duration-300 group-hover:scale-110" />
          )}

          {/* Prompt badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0070f3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0070f3] border-2 border-white"></span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="gnod-ai-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[550px] bg-white rounded-3xl border border-brand-blue-100/60 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-blue-900 text-white p-4 flex items-center justify-between relative">
              <div className="absolute top-0 right-0 w-32 h-full bg-[#0070f3]/10 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#021a30] to-[#0070f3] flex items-center justify-center border border-brand-blue-100/20 shadow-inner">
                    <Bot className="w-5 h-5 text-white animate-soft-float" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-brand-blue-900" />
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <h3 className="font-display font-extrabold text-sm tracking-tight">Gnod AI Trợ lý Sạch</h3>
                    <Sparkles className="w-3.5 h-3.5 text-[#a3e3fc]" />
                  </div>
                  <p className="text-[10px] text-slate-300 flex items-center gap-1">
                    <Waves className="w-2.5 h-2.5 text-[#0070f3] animate-pulse" />
                    <span>Chúng tôi sẵn sàng phục vụ</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1 relative z-10">
                <button
                  onClick={resetConversation}
                  title="Đặt lại hội thoại"
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conversation Window Body */}
            <div className="flex-1 bg-brand-sand overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isBot = msg.sender === "bot";
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isBot ? -15 : 15, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div className="max-w-[85%] flex flex-col">
                      <div
                        className={`p-3.5 rounded-2xl shadow-sm text-left ${
                          isBot
                            ? "bg-white border border-brand-blue-100 text-brand-blue-900 rounded-tl-none whitespace-pre-line"
                            : "bg-brand-blue-900 text-white rounded-tr-none"
                        }`}
                      >
                        {isBot ? renderFormattedText(msg.text) : <p className="text-xs">{msg.text}</p>}
                      </div>
                      
                      <span className={`text-[9px] text-slate-400 mt-1 px-1 ${!isBot ? "text-right" : "text-left"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loader bubble */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] flex flex-col">
                    <div className="bg-white border border-brand-blue-100 text-brand-blue-900 rounded-2xl rounded-tl-none p-3.5 shadow-sm flex items-center space-x-1.5">
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="border-t border-slate-100 bg-white p-3 space-y-2">
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1 mb-1 justify-normal">
                <Sparkles className="w-3 h-3 text-[#0070f3]" />
                <span>Gợi ý câu hỏi nhanh</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto pr-1">
                {QUICK_SUGGESTIONS.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(topic)}
                    className="text-[10.5px] bg-[#f0f8ff] text-brand-blue-900 border border-brand-blue-100 hover:border-[#0070f3] hover:bg-[#e6f4fe] rounded-full px-3 py-1.5 transition-all text-left font-display font-medium cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat message input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="border-t border-slate-100 bg-white p-3 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập câu hỏi của bạn tại đây..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0070f3] rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-800 placeholder-slate-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="bg-[#0070f3] hover:bg-brand-blue-900 disabled:bg-slate-200 text-white disabled:text-slate-400 p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
