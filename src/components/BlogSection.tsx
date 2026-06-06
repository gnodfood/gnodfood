import React, { useState, useMemo } from "react";
import { BLOG_POSTS } from "../data";
import { BlogPost } from "../types";
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  User,
  X,
  ArrowRight,
  TrendingUp,
  Tag,
  Share2,
  ThumbsUp,
  Award,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function BlogSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Get unique categories
  const categories = useMemo(() => {
    const cats = BLOG_POSTS.map((post) => post.category);
    return ["Tất cả", ...Array.from(new Set(cats))];
  }, []);

  // Filter blog posts based on search term and category
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === "Tất cả" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.primaryKeywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.secondaryKeywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleShare = (post: BlogPost) => {
    const text = `Xem bài viết cực kì bổ ích: "${post.title}" từ Gnod Food!`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: text,
        url: window.location.href,
      }).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert("Đã sao chép liên kết bài viết vào bộ nhớ tạm!");
    }
  };

  const allKeywords = useMemo(() => {
    const list: string[] = [];
    BLOG_POSTS.forEach((p) => {
      p.primaryKeywords.forEach((k) => {
        if (!list.includes(k)) list.push(k);
      });
      p.secondaryKeywords.forEach((k) => {
        if (!list.includes(k)) list.push(k);
      });
    });
    return list;
  }, []);

  return (
    <div className="w-full space-y-12">
      {/* Dynamic SEO Insights Ribbon */}
      <div 
        id="seo-keywords-dashboard" 
        className="w-full bg-brand-blue-50/60 border border-brand-blue-100/80 rounded-2xl p-5 sm:p-6 text-left max-w-5xl mx-auto space-y-4 shadow-sm"
      >
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-[#0070f3]/10 text-[#0070f3] rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-brand-blue-900 uppercase tracking-wider">
              Mọi người cũng tìm kiếm
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Các từ khóa đặc sản biển Gnod Sạch được nhiều thực khách quan tâm hàng đầu
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {allKeywords.map((keyword, idx) => (
            <span
              key={idx}
              onClick={() => {
                setSearchTerm(keyword);
                const el = document.getElementById("blog-header");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-brand-blue-100 text-brand-blue-800 text-[11px] font-mono rounded-full border border-brand-blue-100 cursor-pointer shadow-sm transition-all"
            >
              <Tag className="w-2.5 h-2.5 text-[#0070f3]" />
              <span>#{keyword}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Search & Filters Toolbar */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border-b border-brand-blue-100/50 pb-6">
        {/* Category Tabs */}
        <div id="blog-category-tabs" className="flex flex-wrap items-center gap-1.5 justify-center md:justify-start w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-display font-semibold rounded-full transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-brand-blue-900 text-white shadow-md shadow-brand-blue-900/10"
                  : "bg-white border border-brand-blue-100 text-brand-blue-700 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bài viết, nguyên liệu..."
            className="w-full block pl-10 pr-4 py-2.5 bg-white border border-brand-blue-100 rounded-full text-xs text-brand-blue-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent shadow-sm transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-brand-blue-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid List and Empty State */}
      <div className="max-w-6xl mx-auto px-1">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-slate-500 text-sm">Không tìm thấy bài viết nào khớp với từ khóa tìm kiếm.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("Tất cả");
              }}
              className="text-xs text-[#0070f3] font-display font-bold hover:underline"
            >
              Thiết lập lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => setActivePost(post)}
                className="group bg-white rounded-2xl overflow-hidden border border-brand-blue-100/50 shadow-sm hover:shadow-xl hover:border-brand-blue-100 transition-all duration-300 flex flex-col cursor-pointer premium-hover-shine"
              >
                {/* Post Cover Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-brand-blue-900/90 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                    {post.category}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{post.date}</span>
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime} đọc</span>
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-brand-blue-900 leading-snug group-hover:text-[#0070f3] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>

                  {/* Read Action Line */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 text-[11px] text-[#0070f3] font-display font-black tracking-wider uppercase">
                    <span className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-500 font-medium lowercase">bởi {post.author}</span>
                    </span>
                    <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Đọc bài</span>
                      <ArrowRight className="w-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Reader Drawer Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePost(null)}
              className="fixed inset-0 bg-brand-blue-900/40 backdrop-blur-sm"
            />

            {/* Immersive Drawer Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              {/* Toolbar Drawer Head */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setActivePost(null)}
                  className="p-1.5 rounded-full bg-black/45 backdrop-blur-md text-white hover:bg-[#0070f3] transition-all cursor-pointer shadow-md"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Scrollable Document Container */}
              <div className="overflow-y-auto flex-1">
                {/* Beautiful Banner */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100">
                  <img
                    src={activePost.image}
                    alt={activePost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
                  
                  {/* Text Overlay */}
                  <div className="absolute bottom-5 sm:bottom-8 left-5 sm:left-8 right-5 sm:right-8 text-left space-y-2.5">
                    <span className="inline-block bg-brand-blue-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-md">
                      {activePost.category}
                    </span>
                    <h2 className="font-display font-bold text-xl sm:text-3xl text-white leading-tight drop-shadow-md">
                      {activePost.title}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      <span className="flex items-center space-x-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Đăng bởi {activePost.author}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{activePost.date}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Thời gian đọc: {activePost.readTime}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Body */}
                <div className="p-6 sm:p-10 space-y-8 text-left">
                  {/* Article summary */}
                  <div className="border-l-4 border-[#0070f3] pl-4 py-1 italic text-slate-600 text-sm leading-relaxed bg-[#0070f3]/5 rounded-r-xl">
                    "{activePost.summary}"
                  </div>

                  {/* Render paragraphs cleanly */}
                  <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed font-sans font-normal">
                    {activePost.content.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {/* Metadata SEO & Social Integration Cards */}
                  <div className="border-t border-slate-100 pt-6 space-y-6">
                    {/* SEO Key Words Badges */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-display font-medium text-slate-400 uppercase tracking-widest flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Từ khóa chính tối ưu hóa công cụ tìm kiếm:</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activePost.primaryKeywords.map((k, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-100 rounded px-2.5 py-0.5"
                          >
                            {k}
                          </span>
                        ))}
                        {activePost.secondaryKeywords.map((k, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono bg-blue-50 text-blue-800 border border-blue-100 rounded px-2.5 py-0.5"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Action Bar */}
                    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-3.5">
                        <button
                          onClick={() => toggleLike(activePost.id)}
                          className={`flex items-center space-x-2.5 px-4.5 py-2.5 rounded-xl text-xs font-display font-bold transition-all border cursor-pointer ${
                            likedPosts[activePost.id]
                              ? "bg-rose-50 border-rose-200 text-rose-600 scale-95"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <ThumbsUp className={`w-4 h-4 ${likedPosts[activePost.id] ? "fill-rose-500 stroke-rose-600" : ""}`} />
                          <span>{likedPosts[activePost.id] ? "Đã thích bài viết" : "Yêu quý bài viết"}</span>
                        </button>

                        <button
                          onClick={() => handleShare(activePost)}
                          className="flex items-center space-x-2 px-4.5 py-2.5 rounded-xl text-xs font-display font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer transition-all"
                        >
                          <Share2 className="w-4 h-4 text-slate-500" />
                          <span>Chia sẻ</span>
                        </button>
                      </div>

                      {/* Connect Social Links of the Group */}
                      <div className="flex items-center space-x-3">
                        <span className="text-[11px] text-slate-400 font-display font-medium uppercase tracking-wider">Mạng xã hội:</span>
                        <div className="flex items-center gap-2">
                          <a
                            href="https://www.facebook.com/share/14XrZY1ZVLU/?mibextid=wwXIfr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white transition-all shadow-sm"
                            title="Facebook Gnod Food"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                          <a
                            href="https://www.tiktok.com/@gnodfood?_r=1&_t=ZS-96n3kU95xlU"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-black/5 hover:bg-black text-black hover:text-white transition-all shadow-sm"
                            title="TikTok Gnod Food"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.74-.22-.22-.4-.47-.58-.73v7.24c.01 5.26-4.27 9.52-9.52 9.52-5.26-.01-9.52-4.29-9.51-9.55C-.11 9.38 4.25 5.08 9.55 5.1c0 1.34-.01 2.68-.01 4.02-3.01-.13-5.56 2.13-5.71 5.14-.17 3.29 2.44 6.13 5.73 6.15 3.19.02 5.86-2.5 5.92-5.69.02-4.9-.01-9.8-.01-14.7z" />
                            </svg>
                          </a>
                          <a
                            href="https://www.instagram.com/khohaisan_gnodfood?igsh=Y2tiendseWN2ZzZj&utm_source=qr"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-[#ee2a7b]/10 hover:bg-[#ee2a7b] text-[#ee2a7b] hover:text-white transition-all shadow-sm"
                            title="Instagram Gnod Food"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related/Footer Navigation */}
              <div className="bg-slate-50 px-6 sm:px-10 py-4.5 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Bản quyền thuộc về Gnod Food</span>
                <button
                  onClick={() => setActivePost(null)}
                  className="font-display font-medium text-brand-blue-700 hover:text-[#0070f3] flex items-center space-x-1 cursor-pointer"
                >
                  <span>Quay lại trang chủ</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
