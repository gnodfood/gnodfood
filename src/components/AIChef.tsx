import React, { useState } from "react";
import { Sparkles, Compass, ChefHat, Copy, Check, MessageSquare, RefreshCw } from "lucide-react";

export default function AIChef() {
  const [selectedProduct, setSelectedProduct] = useState("Khô Mực Câu Thượng Hạng Phú Quốc");
  const [customProduct, setCustomProduct] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("Tiệc nhậu chiến hữu");
  const [selectedTaste, setSelectedTaste] = useState("Cay nồng phá cách");
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const productOptions = [
    "Khô Mực Câu Thượng Hạng Phú Quốc",
    "Tôm Khô Đất Đại Dương Gnod",
    "Khô Cá Thiểu Sốt Tiêu Đường",
    "Tự nhập sản phẩm khác..."
  ];

  const occasionOptions = [
    "Tiệc nhậu chiến hữu",
    "Quà tặng biếu đối tác Doanh Nghiệp",
    "Bữa cơm gia đình cuối tuần",
    "Ăn nhẹ dã ngoại / Văn phòng",
    "Quà biếu tế nhị Tết Đoàn Viên"
  ];

  const tasteOptions = [
    "Cay nồng phá cách",
    "Đậm đà truyền thống",
    "Ít muối Organic (Giữ vị nguyên bản)",
    "Chua ngọt đưa mồi",
    "Chế biến siêu tốc (Dưới 5 phút)"
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const actualProduct = selectedProduct === "Tự nhập sản phẩm khác..." ? customProduct : selectedProduct;
    if (selectedProduct === "Tự nhập sản phẩm khác..." && !customProduct.trim()) {
      setError("Vui lòng điền tên loại khô hải sản bạn muốn kết hợp.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/ai-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: actualProduct,
          occasion: selectedOccasion,
          taste: selectedTaste,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gặp lỗi trong lúc nhận công thức.");
      }
      setResult(data.recipe);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Không thể kết nối với Chef AI. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render customized recipe layouts from Markdown
  const renderRecipeMarkup = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const cleanLine = line.trim();
      
      if (!cleanLine) return <div key={idx} className="h-2" />;

      // Header h1 or main title
      if (cleanLine.startsWith("# ")) {
        return (
          <h3 key={idx} className="font-display font-extrabold text-2xl text-brand-blue-900 border-b border-brand-blue-100 pb-2 mb-4 mt-6">
            {cleanLine.replace("# ", "")}
          </h3>
        );
      }
      // Header h2 / h3
      if (cleanLine.startsWith("## ") || cleanLine.startsWith("### ")) {
        const title = cleanLine.replace(/^###?\s+/, "");
        return (
          <h4 key={idx} className="font-display font-bold text-lg text-[#0070f3] flex items-center gap-2 mt-5 mb-2">
            <span className="w-1.5 h-4 bg-[#0070f3] rounded-full inline-block"></span>
            {title}
          </h4>
        );
      }
      // Bold items
      if (cleanLine.startsWith("**") && cleanLine.endsWith("**")) {
        return (
          <h4 key={idx} className="font-display font-bold text-lg text-brand-blue-800 mt-5 mb-2">
            {cleanLine.replace(/\*\*/g, "")}
          </h4>
        );
      }
      // Bullet items
      if (cleanLine.startsWith("- ") || cleanLine.startsWith("* ")) {
        const content = cleanLine.replace(/^[-*]\s+/, "");
        // Highlight bold subparts inside bullets
        return (
          <li key={idx} className="ml-4 list-none text-slate-700 my-1.5 pl-5 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:bg-[#0070f3] before:rounded-full">
            {parseInlineMarkdown(content)}
          </li>
        );
      }
      // Numbered lists
      const numMatch = cleanLine.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex gap-3 my-2.5 items-start">
            <span className="font-mono bg-[#e6f4fe] text-[#0070f3] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              {numMatch[1]}
            </span>
            <p className="text-slate-700 leading-relaxed text-sm">
              {parseInlineMarkdown(numMatch[2])}
            </p>
          </div>
        );
      }

      // Default paragraph
      return (
        <p key={idx} className="text-slate-700 leading-relaxed text-sm mb-2.5">
          {parseInlineMarkdown(cleanLine)}
        </p>
      );
    });
  };

  // Quick helper to render bold text inside blocks
  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-brand-blue-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div id="ai-chef-section" className="bg-white rounded-3xl border border-brand-blue-100 shadow-xl overflow-hidden self-stretch mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Inputs Panel */}
        <div className="lg:col-span-5 bg-brand-blue-50/50 p-6 sm:p-8 border-r border-[#e1f0fc]">
          <div className="flex items-center space-x-2 text-[#0070f3] mb-3">
            <ChefHat className="w-6 h-6" />
            <span className="text-xs uppercase tracking-widest font-extrabold font-display">CHEF AI Gnod Food</span>
          </div>
          <h3 className="font-display font-extrabold text-2xl tracking-tight text-brand-blue-900 mb-2">
            Ý Tưởng Bàn Tiệc & Công Thức Độc Bản
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Chọn nguyên liệu thượng hạng Gnod, thời cơ phục vụ và phong cách khẩu vị của bạn. Trí tuệ ảo của Bếp trưởng Gnod Food sẽ tạo ra một kịch bản trải nghiệm ẩm thực tinh xảo dành riêng cho bạn.
          </p>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Input 1: Product Selection */}
            <div>
              <label className="block text-xs font-bold text-brand-blue-900 uppercase tracking-wider mb-2">
                1. Chọn khô hải sản
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0070f3] focus:ring-1 focus:ring-[#0070f3] text-brand-blue-900 transition-all font-medium cursor-pointer"
              >
                {productOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              
              {selectedProduct === "Tự nhập sản phẩm khác..." && (
                <input
                  type="text"
                  placeholder="Ví dụ: Khô cá dứa Một Nắng Phú Quốc..."
                  value={customProduct}
                  onChange={(e) => setCustomProduct(e.target.value)}
                  className="w-full mt-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0070f3] text-brand-blue-900 placeholder:text-slate-400 font-medium"
                  required
                />
              )}
            </div>

            {/* Input 2: Occasion Selection */}
            <div>
              <label className="block text-xs font-bold text-brand-blue-900 uppercase tracking-wider mb-2">
                2. Dịp thưởng thức hoặc biếu tặng
              </label>
              <div className="flex flex-wrap gap-2">
                {occasionOptions.map((opt) => {
                  const isSelected = selectedOccasion === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedOccasion(opt)}
                      className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? "bg-brand-blue-900 text-white border-brand-blue-900"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#0070f3] hover:text-brand-blue-900"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 3: Taste Selection */}
            <div>
              <label className="block text-xs font-bold text-brand-blue-900 uppercase tracking-wider mb-2">
                3. Gu hương vị hoặc yêu cầu chế biến
              </label>
              <div className="flex flex-wrap gap-2">
                {tasteOptions.map((opt) => {
                  const isSelected = selectedTaste === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedTaste(opt)}
                      className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${
                        isSelected
                          ? "bg-[#0070f3] text-white border-[#0070f3]"
                          : "bg-white text-slate-600 border-slate-200 hover:border-[#0070f3] hover:text-brand-blue-900"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-blue-900 to-[#0070f3] hover:from-[#0070f3] hover:to-brand-blue-900 text-white font-display font-semibold transition-all py-3.5 px-6 rounded-xl hover:shadow-lg mt-4 disabled:opacity-50 cursor-pointer ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Bếp Trưởng đang lên ý tưởng...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Khởi Tạo gợi ý Chef Gnod</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Recipe Display */}
        <div className="lg:col-span-7 bg-brand-sand min-h-[400px] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          
          {/* Faded Background Pattern */}
          <div className="absolute right-0 bottom-0 opacity-[0.03] select-none pointer-events-none">
            <ChefHat className="w-96 h-96 text-brand-blue-900" />
          </div>

          <div className="relative z-10 w-full h-full flex flex-col justify-between">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-700">
                <span className="text-xl">⚠️</span>
                <div>
                  <h4 className="font-bold text-sm">Gặp lỗi trong quá trình chế biến ý tưởng</h4>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {!isLoading && !result && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#e2effa] flex items-center justify-center shadow-sm text-[#0070f3] mb-4">
                  <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
                </div>
                <h4 className="font-display font-bold text-lg text-brand-blue-800 mb-1">
                  Đang Đợi Ý Tưởng Của Bạn
                </h4>
                <p className="text-slate-400 text-xs px-2 max-w-sm">
                  Chọn sản phẩm hải sản khô yêu thích, gu hương vị mong muốn bên trái rồi nhấn nút khởi tạo để mở ra cẩm nang ẩm thực độc bản từ Chef AI.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="relative mb-6">
                  {/* Rotating Chef Hat Accent */}
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#0070f3] animate-spin"></div>
                  <ChefHat className="w-6 h-6 text-[#0070f3] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <span className="text-xs font-bold text-[#0070f3] uppercase tracking-widest block mb-2 animate-pulse">
                  Nhận kịch bản từ đại dương...
                </span>
                <p className="text-slate-500 text-sm font-medium italic max-w-sm">
                  "Đang tư duy hương vị tiêu lốt Phú Quốc kết hợp vị ngọt nắng của giàn thố nôm..."
                </p>
              </div>
            )}

            {result && !isLoading && (
              <div className="flex-1 flex flex-col h-full justify-between">
                
                {/* Header Actions for Generated Card */}
                <div className="flex justify-between items-center bg-[#f1f6fa] border border-[#e1eaef] rounded-xl px-4 py-2.5 mb-4">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MessageSquare className="w-4 h-4 text-[#0070f3]" />
                    <span className="text-xs font-semibold text-brand-blue-800 font-mono">Ý tưởng đã sẵn sàng</span>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 py-1 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-brand-blue-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Chép công thức</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recipe Body Layout styled like a fine premium page */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm overflow-y-auto max-h-[460px]">
                  {renderRecipeMarkup(result)}
                </div>

                {/* Footnote */}
                <p className="text-[11px] text-slate-400 italic mt-3 text-center">
                  * Công thức ẩm thực độc quyền được tư duy cá nhân hóa bởi AI Bếp Trưởng Gnod Food.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
