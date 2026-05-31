import { Product, CareerOpportunity, Review, BlogPost } from "./types";
import squidPremium from "./assets/images/squid_premium_1780063740221.png";
import shrimpGiftGnodFood from "./assets/images/shrimp_gift_gnod_food_1780068930719.png";
import stingrayVungtauBanner from "./assets/images/stingray_vungtau_banner_1780068780009.png";
import stingrayMame250g from "./assets/images/stingray_mame_250g_1780070543075.png";
import heroVungtauBeach from "./assets/images/hero_vungtau_beach_1780066394955.png";
import shrimpGift from "./assets/images/shrimp_gift_1780063762969.png";
import stingrayVungtau from "./assets/images/stingray_vungtau_1780066109424.png";
import seafoodJarsBeach from "./assets/images/gnod_seafood_jars_beach_1780217243788.png";
import stingrayMameBanner from "./assets/images/stingray_mame_banner_1780217413880.png";

export const PRODUCTS: Product[] = [
  {
    id: "kho-muc-phu-quoc",
    name: "Khô Mực Câu Thượng Hạng Phú Quốc",
    subName: "Hand-selected sun-dried premium squid",
    price: "850.000",
    originalPrice: "950.000",
    unit: "Hộp 500g (Loại 1 - Size lớn 10-12 con)",
    description: "Tuyển chọn từ những mẻ mực sữa câu khơi tươi rói tại bãi biển Phú Quốc, được phơi sào thủ công dưới nắng giòn tự nhiên của biển khơi giúp sớ thịt dẻo dai, ngọt tự nhiên, phủ phấn trắng mỏng thanh lịch.",
    details: [
      "Cam kết 100% mực câu phơi xào xịn tại Phú Quốc",
      "Phơi đủ 5 nắng tốt nhất, đạt chuẩn độ ẩm 15%",
      "Không hề dùng chất chống mốc hay bảo quản nhân tạo",
      "Bảo quản đóng gói hút chân không hai lớp sang trọng"
    ],
    image: squidPremium,
    tags: ["Thượng Hạng", "Ăn Nhậu Cao Cấp", "Bán Chạy Nhất"],
    specs: [
      { label: "Xuất xứ", value: "Đảo Ngọc Phú Quốc" },
      { label: "Phương pháp", value: "Đánh bắt câu sào, phơi giàn lưới" },
      { label: "Hạn sử dụng", value: "12 tháng (Trữ ngăn đông tốt nhất)" }
    ]
  },
  {
    id: "tom-kho-luxury-gift",
    name: "Hộp Quà Tôm Khô Đất Đại Dương Gnod Food",
    subName: "Premium natural dried ocean shrimp",
    price: "680.000",
    unit: "Hộp gỗ sinh thái 400g (Size đại)",
    description: "Tôm đất thiên nhiên từ cửa sông biển được luộc bằng bí quyết gia truyền Gnod Food, lột vỏ tỉ mỉ rồi phơi sấy chậm để giữ trọn màu đỏ cam hổ phách tự nhiên rực rỡ và vị ngọt đậm dầy đặc trưng.",
    details: [
      "Nguyên liệu tôm đất sống tự nhiên, thịt dai và ngọt đượm",
      "Sấy kỹ thuật sinh học gián tiếp giữ nguyên dinh dưỡng",
      "Thích hợp làm quà tặng biếu sang trọng tinh tế",
      "Màu đỏ tự nhiên không phẩm màu hay hóa chất độc hại"
    ],
    image: shrimpGiftGnodFood,
    tags: ["Quà Tặng Thượng Lưu", "Không Màu Nhân Tạo", "Đại Dương Tuyển Chọn"],
    specs: [
      { label: "Xuất xứ", value: "Vùng ngập mặn Cà Mau / Kiên Giang" },
      { label: "Đóng gói", value: "Hộp gỗ thông Organic & hũ thủy tinh tinh xảo" },
      { label: "Ứng dụng", value: "Ăn trực tiếp, làm gỏi, kho quẹt quý tộc" }
    ]
  },
  {
    id: "kho-ca-duoi-vung-tau",
    name: "Khô Cá Đuối Đen Thượng Hạng Vũng Tàu",
    subName: "Premium sun-dried stingray from Vung Tau",
    price: "450.000",
    unit: "Hũ thủy tinh Ceramic 450g",
    description: "Cá đuối đen (cá đuối nghệ) tươi rói đánh bắt trực tiếp từ các ngư trường sâu khơi xa biển Vũng Tàu. Thịt cá đuối sau khi phơi đủ nắng có vị ngọt bùi tự nhiên dẻo dai đặc trưng, thớ sụn mỏng giòn sần sật khi nướng tỏa hương thơm lừng quyến rũ.",
    details: [
      "100% cá đuối nghệ tươi tuyển chọn đặc sản vùng biển Vũng Tàu",
      "Kỹ thuật xẻ mỏng phơi lưới khô tự nhiên giữ độ ẩm tiêu chuẩn 18%",
      "Hoàn toàn không tẩm ướp phẩm màu hay chất bảo quản nhân tạo",
      "Sụn sần sật tự nhiên, dồi dào dinh dưỡng & canxi bồi bổ sức khỏe"
    ],
    image: stingrayVungtauBanner,
    tags: ["Đặc Sản Vũng Tàu", "Nhậu Sành Điệu", "Sụn Giòn Rụm"],
    specs: [
      { label: "Xuất xứ", value: "Thành phố biển Vũng Tàu" },
      { label: "Hương vị", value: "Ngọt thanh tự nhiên, thơm khói sụn giòn" },
      { label: "Hạn sử dụng", value: "12 tháng (Bảo quản tủ mát hoặc tủ đông)" }
    ]
  },
  {
    id: "kho-ca-duoi-mam-me-100g",
    name: "Khô Cá Đuối Sém Lửa Tặng Kèm Mắm Me (Hũ Nhỏ 100g)",
    subName: "Snack-size dried stingray with tamarind sauce",
    price: "89.000",
    unit: "Hũ nhỏ tiện lợi 100g",
    description: "Phiên bản hũ nhỏ tiện nghi dành cho cá nhân, học sinh, sinh viên hay dân văn phòng ăn vặt xế chiều. Sợi khô đuối nướng chín thơm ngon kết hợp mắm me chua ngọt đậm vị.",
    details: [
      "Khô cá đuối sấy xé sợi tơi, dẻo dai ngậy vị phù hợp ăn vặt",
      "Hũ nhỏ xinh xắn kèm sẵn hũ mắm me vị chua cay kích thích ngon miệng",
      "Giải pháp kinh tế, sạch sẽ và vệ sinh hàng đầu cho một bữa ăn nhẹ",
      "Mở nắp là có thể dùng ngay cực kỳ nhanh gọn và tiện lợi"
    ],
    image: stingrayMame250g,
    tags: ["Khách Hàng Nhỏ", "Ăn Vặt Văn Phòng", "Kèm Mắm Me Chua Cay"],
    specs: [
      { label: "Xuất xứ", value: "Vũng Tàu" },
      { label: "Quy cách", value: "Hũ nhựa PET 100g + Hũ mắm me" },
      { label: "Hạn sử dụng", value: "6 tháng (Bảo quản nhiệt độ thường hoặc mát)" }
    ]
  },
  {
    id: "kho-ca-duoi-mam-me-250g",
    name: "Khô Cá Đuối Sém Lửa Tặng Kèm Mắm Me (Hũ Vừa 250g)",
    subName: "Medium-size dried stingray with tamarind sauce",
    price: "189.000",
    unit: "Hũ vừa tụ họp 250g",
    description: "Sản phẩm thiết kế hoàn hảo cho nhóm bạn nhỏ ngồi lai rai hay gia dịch cùng thưởng thức buổi tối. Cá đuối dày cơm vừa vị, chấm ngập trong mắm me chua dốt sóng sánh.",
    details: [
      "Khô cá nghệ xé tay miếng vừa miệng chuẩn vị truyền thống",
      "Sốt mắm me chua cay mặn ngọt nồng nàn tăng nhiệt độ cho mọi cuộc vui",
      "Hũ trung bít kín giúp giữ trọn độ ẩm dẻo dính cùng sụn giòn sần sật",
      "Tuyệt đối nói không với phẩm màu và các hương liệu tổng hợp"
    ],
    image: stingrayMame250g,
    tags: ["Nhóm Bạn Gặp Mặt", "Lai Rai Gia Đình", "Mắm Me Cay Chua"],
    specs: [
      { label: "Xuất xứ", value: "Vũng Tàu" },
      { label: "Quy cách", value: "Hũ PET kín khí 250g + Hũ mắm me" },
      { label: "Hạn sử dụng", value: "6 tháng (Bảo quản tủ mát sẽ cực ngon)" }
    ]
  },
  {
    id: "kho-ca-duoi-mam-me-500g",
    name: "Khô Cá Đuối Sém Lửa Tặng Kèm Mắm Me (Hũ Lớn 500g)",
    subName: "Family-pack dried stingray with tamarind sauce",
    price: "369.000",
    unit: "Hộp lớn tiết kiệm 500g",
    description: "Lựa chọn tiết kiệm tối đa cho các buổi party lớn, liên hoan gia đình hay mồi nhậu dài lâu. Cá đuối nướng xé sợi sẵn bản to, chấm sốt mắm me cay cay chua ngọt ăn đã thèm.",
    details: [
      "Hộp lớn dung tích khủng, tiết kiệm hơn đến 20% so với mua hũ lẻ",
      "Khô cá đuối sợi lớn, dày cơm chiên/nướng sẵn sém lửa cực hấp dẫn",
      "Sốt mắm me hảo hạng đóng hũ lớn thỏa thích chấm ngập miệng",
      "Hộp nhựa cứng sang trọng, nắp thiếc giật kín hoàn toàn siêu sang xịn"
    ],
    image: stingrayMame250g,
    tags: ["Liên Hoan Đại Tiệc", "Siêu Nhiều Tiết Kiệm", "Ăn Đã Thèm"],
    specs: [
      { label: "Xuất xứ", value: "Vũng Tàu" },
      { label: "Quy cách", value: "Hộp lớn 500g + Hũ mắm me lớn" },
      { label: "Hạn sử dụng", value: "6 tháng (Bảo quản mát hoặc đông duy trì độ dẻo)" }
    ]
  }
];

export const CAREER_OPPORTUNITIES: CareerOpportunity[] = [
  {
    id: "tuyen-truong-phong-kinh-doanh",
    title: "Trưởng Phòng Phân Phối",
    department: "Phòng Kinh Doanh Toàn Quốc",
    location: "Trụ sở TP. Hồ Chí Minh / Hybrid",
    salary: "20.000.000 - 35.000.000 VND / tháng + Thưởng doanh số",
    type: "Toàn thời gian",
    description: "Chịu trách nhiệm nghiên cứu thị trường phân phối quà tặng cao cấp và phát triển hệ thống đại lý kinh doanh bánh kẹo, nông sản, khô hải sản Gnod Food trên phạm vi toàn quốc.",
    requirements: [
      "Tối thiểu 3 năm kinh nghiệm quản lý kênh đại lý (GT/MT hoặc Quà tặng doanh nghiệp)",
      "Kĩ năng đàm phán thương thảo xuất sắc, tác phong thanh lịch lịch thiệp",
      "Có tư duy đổi mới sáng tạo, yêu thích quảng bá ẩm thực quê hương chất lượng cao"
    ]
  },
  {
    id: "tuyen-ctv-kinh-doanh",
    title: "Đối Tác / Cộng Tác Viên Kinh Doanh Quà Biếu",
    department: "Kênh Phát Triển Khách Hàng Doanh Nghiệp (B2B)",
    location: "Toàn quốc (Thời gian linh hoạt)",
    salary: "Chiết khấu 15% - 25% theo giá trị đơn hàng (Trung bình 8M - 20M/tháng)",
    type: "Bán thời gian / Cộng tác viên",
    description: "Giới thiệu các dòng sản phẩm hộp quà khô hải sản Gnod Food độc quyền cho doanh nghiệp làm quà tặng lễ Tết, chương trình tri ân khách hàng VIP, quà tặng hội nghị.",
    requirements: [
      "Yêu thích ẩm thực cao cấp, có mạng lưới quan hệ doanh nghiệp hoặc khách hàng cá nhân khá tốt",
      "Có kỹ năng giao tiếp niềm nở, trung thực, tinh thần trách nhiệm cao",
      "Được tào tạo bài bản về hình ảnh thương hiệu và quy cách sản phẩm cao cấp"
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: "rev-1",
    author: "Phan Hoài Nam",
    role: "Giám đốc sáng tạo, Bloom Studio",
    avatar: "https://picsum.photos/seed/user1/100/100",
    rating: 5,
    comment: "Khô cá đuối đen thượng hạng Vũng Tàu của Gnod Food thực sự đẳng cấp, thớ thịt dày ngon ngọt bùi bùi tự nhiên, sụn mỏng dai giòn nướng thơm lừng quyến rũ không bị khô cứng. Cực kì hài lòng!"
  },
  {
    id: "rev-2",
    author: "Linh Đan Nguyễn",
    role: "Travel Blogger, Đan Đan Foodie",
    avatar: "https://picsum.photos/seed/user2/100/100",
    rating: 5,
    comment: "Nhà mình cực kỳ mê món Khô Cá Đuối Sém Lửa chấm mắm me chua cay ở đây. Miếng khô cá đuối nướng xé tay dẻo dai vừa vị chấm ngập trong chén mắm me sánh kẹo chua dốt cay nồng, ăn một lần là nhớ mãi."
  },
  {
    id: "rev-3",
    author: "Bùi Trường Giang",
    role: "Chủ thương hiệu ẩm thực mộc",
    avatar: "https://picsum.photos/seed/user3/100/100",
    rating: 5,
    comment: "Kinh doanh khô hải sản khó nhất là giữ được hương vị nguyên bản và sự sạch sẽ. Gnod Food thật sự làm hài lòng tôi từ sự dai giòn sần sật bồi bổ canxi của khô cá đuối cho đến mắm me hảo tinh tế."
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "tinh-hoa-kho-hai-san-vung-tau",
    title: "Khô hải sản Vũng Tàu - Tinh hoa ẩm thực nắng gió biển khơi",
    summary: "Khám phá lý do tại sao khô hải sản Vũng Tàu, đặc biệt là các dòng khô cá đuối nghệ, khô mực câu từ Gnod Food lại mang hương vị ngọt nguyên bản vượt trội. Bài viết phân tích quy trình phơi nắng tự nhiên trứ danh.",
    date: "18/05/2026",
    author: "Bếp Trưởng Gnod",
    readTime: "5 phút",
    category: "Cẩm nang ẩm thực",
    image: seafoodJarsBeach,
    tags: ["Khô Hải Sản", "Đặc Sản Vũng Tàu", "Bí Quyết"],
    primaryKeywords: ["khô hải sản vũng tàu", "khô cá đuối mắm me", "khô mực câu thượng hạng"],
    secondaryKeywords: ["đặc sản vũng tàu làm quà", "hải sản sạch", "phơi nắng tự nhiên"],
    content: [
      "Vùng đất biển Vũng Tàu từ lâu đã nổi tiếng với nguồn hải sản phong phú và chất lượng vượt trội. Nhưng có một nét văn hóa ẩm thực độc đáo khác luôn khiến du khách phương xa phải bồi hồi nhớ mãi chính là những mẻ khô hải sản vũng tàu được chế biến vô cùng kỳ công. Khác với các dòng sản phẩm đại trà trên thị trường hiện nay, khô hải sản cao cấp thương hiệu Gnod Food được làm từ nguồn cá tươi rói mang về trực tiếp từ các chuyến tàu cập bến sớm, giữ trọn từng giọt ngọt tự nhiên của đại dương bao la.",
      "Để tạo ra được những thớ khô mềm mại, không bị khô cứng hay có mùi tanh khó chịu, những người thợ lành nghề tại Gnod Food phải tuân thủ nghiêm ngặt quy trình phơi sấy thủ công truyền thống. Cá tươi sau khi làm sạch kỹ lưỡng sẽ được xếp đều đặn trên những giàn lưới cao ráo đón trọn cái nắng giòn tan và luồng gió mặn mòi thổi vào từ bãi cát biển Vũng Tàu. Đây là kỹ thuật phơi sào lộng gió thiên nhiên giúp cá khô đều từ trong ra ngoài, lưu giữ tối đa toàn bộ các hàm lượng acid amin có lợi và độ dẻo bền bỉ trong từng thớ thịt cá dai ngọt ngọt bùi.",
      "Đặc biệt, dòng sản phẩm khô cá đuối mắm me của chúng tôi được xem như một kiệt tác ẩm thực đường phố được nâng tầm quý tộc. Sử dụng nguồn cá đuối nghệ tươi xẻ mỏng, phơi đủ độ dẻo rồi nướng sém cạnh thơm lừng làm mồi nhắm sành sỏi. Bên cạnh đó, khô mực câu thượng hạng cũng được lựa chọn vô cùng khắt khe từ từng con mực sữa câu xào trực tiếp ngoài khơi xa biển Phú Quốc. Chúng tôi cam kết tuyệt đối không sử dụng chất tạo nạc, không phẩm màu độc hại và không hóa chất bảo quản để mang đến trải nghiệm sức khỏe ẩm thực chuẩn mực nhất cho người tiêu dùng.",
      "Nếu bạn đang có ý định du lịch hoặc tìm kiếm món đặc sản vũng tàu làm quà ý nghĩa cho đối tác, gia đình hay bạn bè thân thiết, thì các sản phẩm khô đóng hũ tinh tế của Gnod Food xứng đáng là sự lựa chọn hàng đầu. Sự kết hợp giữa bao bì sang trọng đẳng cấp và chất lượng ẩm thực sạch vượt trội sẽ thể hiện trọn vẹn tấm lòng chân thành và gu thưởng thức tinh tế của người tặng."
    ]
  },
  {
    id: "bi-quyet-nuong-ca-duoi-mam-me",
    title: "Bí quyết nướng khô cá đuối mắm me sém lửa giòn rụm tại nhà",
    summary: "Hướng dẫn chi tiết cách chế biến món khô cá đuối mắm me đúng chuẩn nhà hàng. Bật mí mẹo nướng sém cạnh thơm lừng, giữ độ dẻo sụn và phương pháp gia truyền làm nước chấm mắm me sóng sánh đậm vị chua ngọt.",
    date: "20/05/2026",
    author: "Chef AI Gnod",
    readTime: "4 phút",
    category: "Công thức món ngon",
    image: stingrayVungtau,
    tags: ["Công Thức Bí Truyền", "Khô Cá Đuối", "Mắm Me"],
    primaryKeywords: ["khô cá đuối mắm me", "khô hải sản vũng tàu", "cách nướng khô cá đuối ngon"],
    secondaryKeywords: ["đặc sản vũng tàu làm quà", "sốt mắm me gia truyền", "mồi ngon lai rai"],
    content: [
      "Món khô cá đuối mắm me từ lâu đã trở thành biểu tượng ăn vặt và lai rai không thể thiếu của các tín đồ ẩm thực biển cả. Sự kết hợp hoàn hảo giữa vị ngọt bùi pha chút béo ngậy của thịt cá đuối, cái sần sật dai dai của lớp sụn mỏng, hòa quyện cùng nước sốt mắm me chua dốt cay nồng tạo nên một sức hút khó có thể cưỡng lại. Tuy nhiên, để nướng khô cá đuối nghệ sao cho thơm phưng phức, giữ được thớ thịt mềm ngọt dẻo dai mà không bị khô cháy hay cứng như củi thì không phải ai cũng biết.",
      "Hôm nay, Chef AI đến từ Gnod Food sẽ hướng dẫn cho các bạn cách nướng khô cá đuối ngon vô cùng đơn giản bằng lò nướng, nồi chiên không dầu hay bếp than truyền thống ngay tại nhà. Bước đầu tiên cực kỳ quan trọng là bạn cần chuẩn bị miếng khô cá đuối đen chất lượng tốt, có màu vàng trong tự nhiên và thớ thịt dày dặn. Trước khi nướng, bạn có thể vẩy nhẹ một chút nước lọc hoặc một muỗng cà phê rượu trắng lên bề mặt cá để thớ cá hút đủ độ ẩm ẩm mịn, giúp thành phẩm sau khi nướng giữ được độ mềm dẻo đặc sệt đặc trưng.",
      "Khi nướng bằng bếp than, hãy giữ lửa ở mức nhỏ liu riu và lật cá liên tục đều tay. Nếu sử dụng nồi chiên không dầu, bạn thiết lập nhiệt độ khoảng 160 độ C trong vòng 3 đến 5 phút cho mỗi mặt cá cho đến khi thấy rìa cá hơi sém nhẹ và tỏa hương thơm nồng nàn quyến rũ. Sau khi cá chín sém lửa, ngay lập tức đem ra dùng chày gỗ đập dập nhẹ nhàng để thớ thịt cá bung tơi xốp, dẻo dai rồi tiến hành xé sợi vừa ăn theo thớ sụn mỏng giòn sần sật.",
      "Yếu tố quyết định 50% độ ngon của món ăn nằm ở bát sốt mắm me sóng sánh kẹo chua ngọt đi kèm. Gnod Food sử dụng me chín tự nhiên lọc lấy nước cốt đặc, đun sôi cùng đường thốt nốt, mắm nhĩ cao cấp, ớt sừng băm và tỏi phi thơm lừng cho đến khi hỗn hợp keo lại sóng sánh lấp lánh như hổ phách. Chấm một miếng khô cá đuối nướng sém vàng ngập trong chén mắm me chua cay mặn ngọt nồng nàn, nhâm nhi cùng ly bia mát lạnh bên bạn bè thì mọi mệt mỏi thường nhật dường như đều tan biến hoàn toàn."
    ]
  },
  {
    id: "chon-kho-muc-cau-thuong-hang",
    title: "Cách chọn khô mực câu thượng hạng chất sành ăn chính gốc",
    summary: "Làm thế nào để phân biệt khô mực câu thượng hạng phơi giàn lưới tự nhiên với khô mực cào công nghiệp giá rẻ? Khám phá 5 đặc điểm nhận dạng rõ ràng về màu phấn, độ dẻo dai và vị ngọt hậu sâu lắng.",
    date: "25/05/2026",
    author: "Bếp Trưởng Gnod",
    readTime: "6 phút",
    category: "Cẩm nang mua sắm",
    image: squidPremium,
    tags: ["Khô Mực Câu", "Phú Quốc", "Mẹo Chọn Hải Sản"],
    primaryKeywords: ["khô mực câu thượng hạng", "khô hải sản vũng tàu", "địa chỉ bán khô hải sản uy tín"],
    secondaryKeywords: ["mực khô phơi sào", "đặc sản làm quà", "chất lượng loại 1"],
    content: [
      "Mực khô là món ăn quen thuộc bậc nhất trên các bàn tiệc từ bình dân đến cao cấp, nhưng thế giới khô mực thực tế lại vô cùng phong phú và có sự phân hóa chất lượng rõ rệt. Với những người sành ăn thực thụ, danh hiệu khô mực câu thượng hạng luôn đứng ở vị trí ngôi vương độc tôn mà không một loài mực nào khác có thể so sánh được. Mực câu được ngư dân đánh bắt thủ công từng con bằng câu sào ngoài khơi xa, khi mang lên boong tàu vẫn còn sống nhấp nháy nên thịt mực vô cùng ngọt dày, sạch tinh khiết.",
      "Để không bị nhầm lẫn giữa mực câu thượng hạng với mực cào (được đánh bắt bằng lưới cào số lượng lớn, mực dễ bị trầy xước, dập nát và ngâm nước lâu nên thịt mỏng, nhạt nhẽo), người tiêu dùng sành sỏi cần chú ý đến một số đặc điểm cảm quan rõ rệt. Đầu tiên là lớp phấn trắng mọc tự nhiên trên bề mặt da. Khô mực câu chất lượng cao sẽ sở hữu lớp phấn trắng mỏng mịn, trải đều vừa phải bóng bẩy chứ không quá dày đặc bám ráp tay (lớp phấn quá dày thường là dấu hiệu mực để lâu, bảo quản kém hoặc bị tẩm hóa chất chống mốc).",
      "Thứ hai, bạn hãy quan sát kỹ màu sắc thớ thịt dưới ánh sáng mặt trời. Thân mực câu thượng hạng chính gốc sẽ có sắc hồng nhạt tự nhiên vô cùng tươi sáng, phần lưng mực có những chấm xám đen mịn rõ ràng chứ không bị thâm xỉn hay đỏ lòm. Khi sờ tay vào cảm nhận rõ độ dẻo dai vững chãi, thịt mực khô ráo, không bị dính ướt hay lưu lại mùi khai hôi. Khi nướng lên, mực câu thượng hạng tỏa ra mùi thơm ngon cực kỳ nồng nàn, sớ thịt xé ra có màu hồng nhạt đặc trưng, thịt mực dai ngọt đậm đà, càng nhai kĩ càng cảm thấy vị ngọt hậu béo bùi lan tỏa sâu sắc.",
      "Tìm kiếm một địa chỉ bán khô hải sản uy tín để gửi gắm niềm tin sức khỏe cho gia đình giữa thị trường đầy rẫy sản phẩm kém chất lượng là bài toán đau đầu. Hiểu được nỗi lo đó, Gnod Food cam kết tuyển chọn 100% dòng khô mực câu sào biển thủ công Phú Quốc loại 1 size lớn dày cơm dẻo ngọt, đóng gói hút chân không hai lớp vô cùng vệ sinh, sang trọng lịch thiệp làm quà tri ân đẳng cấp."
    ]
  },
  {
    id: "kho-hai-san-lam-qua-bieu-doanh-nghiep",
    title: "Khô hải sản làm quà tặng doanh nghiệp: Đẳng cấp tinh tế từ thiên nhiên",
    summary: "Xu hướng lựa chọn sản vật tự nhiên sạch cao cấp thay thế cho bánh kẹo công nghiệp. Khám phá lý do hộp quà tôm khô đất cổ truyền, khô cá đuối đen thượng hạng Gnod Food được các đối tác lựa chọn biếu VIP.",
    date: "28/05/2026",
    author: "CEO Gnod Food",
    readTime: "5 phút",
    category: "Xu hướng thị trường",
    image: shrimpGiftGnodFood,
    tags: ["Quà Doanh Nghiệp", "Quà Tết", "B2B"],
    primaryKeywords: ["đặc sản vũng tàu làm quà", "khô hải sản vũng tàu", "khô mực câu thượng hạng"],
    secondaryKeywords: ["địa chỉ bán khô hải sản uy tín", "hộp quà sinh thái", "quà biếu đối tác"],
    content: [
      "Trong thời đại kinh tế số phát triển vượt bậc cùng ý thức chăm sóc sức khỏe của con người không ngừng được nâng cao, thói quen tặng quà doanh nghiệp cũng đang có những bước chuyển mình vô cùng mạnh mẽ. Những hộp bánh kẹo công nghiệp ngọt lịm hay những chai rượu nhập đắt đỏ nay đã dần được thay thế bằng những sản vật nông nghiệp hữu cơ sạch, mang đậm dấu ấn bản sắc địa phương độc đáo. Trong đó, xu hướng chọn khô hải sản vũng tàu cao cấp làm quà biếu đang dẫn đầu danh sách ưa chuộng của giới văn phòng và doanh nghiệp lớn.",
      "Lý do cốt lõi tạo nên sức hút khác biệt này chính là tính thực tế cùng giá trị ẩm thực nguyên bản tinh túy của sản phẩm. Một hộp quà khô mực câu thượng hạng Phú Quốc hay khô cá đuối mắm me Vũng Tàu thượng hạng Gnod Food không chỉ là một món ăn ngon đơn thuần, mà còn là khởi nguồn cho những câu chuyện đầm ấm quanh bàn ăn gia đình ngày cuối tuần hay những buổi gặp gỡ thâm tình đối tác sành sỏi. Nó mang hơi thở mặn mòi hào sảng của đại dương tươi đẹp và sự chu đáo nhiệt tình đậm chất Việt Nam.",
      "Tại Gnod Food, chúng tôi định nghĩa lại khái niệm 'quà biếu hải sản' bằng thiết kế hộp gỗ sinh thái thông Organic vô cùng sang trọng, kết hợp hũ thủy tinh Ceramic kín khí bảo quản tuyệt mỹ tinh xảo. Các dòng tôm khô đất ngọt đượm màu hổ phách kết kết duyên cùng khô cá đuối nghệ thơm sém sụn giòn tạo nên mâm cơm mộc mạc thơm lừng mà đẳng cấp vượt thời gian. Điều này giúp doanh nghiệp gửi gắm thông điệp bảo vệ sức khỏe xanh, trân trọng ẩm thực lành mạnh tự nhiên đến mọi khách hàng VIP.",
      "Gnod Food tự hào là địa chỉ bán khô hải sản uy tín được hàng trăm doanh nghiệp vừa và nhỏ đến các tập đoàn lớn lựa chọn làm đối tác cung ứng quà tặng thường niên. Với chính sách chiết khấu linh hoạt, đóng gói cá nhân hóa khắc logo riêng biệt mộc mạc đẳng cấp cùng cam kết chất lượng 100% tự nhiên không hương liệu, chúng tôi tự tin đồng hành cùng thương hiệu của bạn bay xa trên mọi kết nối kinh doanh."
    ]
  },
  {
    id: "tom-kho-dat-ca-mau-cam-nang",
    title: "Tôm khô đất Cà Mau - Sắc hổ phách thiên nhiên ngọt thắm vị sông biển",
    summary: "Tìm hiểu bí quyết làm nên danh tiếng lâu đời của tôm đất sinh trưởng tự nhiên trong rừng ngập mặn Cà Mau. Công thức luộc sấy chậm gia truyền của Gnod Food giúp bảo toàn sắc đỏ tự nhiên sần sật.",
    date: "31/05/2026",
    author: "Bếp Trưởng Gnod",
    readTime: "4 phút",
    category: "Cẩm nang ẩm thực",
    image: shrimpGiftGnodFood,
    tags: ["Tôm Khô Đất", "Cà Mau", "Hương Vị Nguyên Bản"],
    primaryKeywords: ["khô hải sản vũng tàu", "địa chỉ bán khô hải sản uy tín", "khô mực câu thượng hạng"],
    secondaryKeywords: ["tôm đất tự nhiên", "ẩm thực cổ truyền", "quà biếu cao cấp"],
    content: [
      "Nhắc đến tôm khô Việt Nam, vị trí độc tôn không thể thay thế chắc chắn thuộc về loài tôm đất sinh trưởng tự nhiên tại các vùng đầm lầy và rừng ngập mặn trù phú của mũi Cà Mau. Khác với tôm nuôi công nghiệp bằng thức ăn tổng hợp có thịt nhạt nhẽo và xốp bở, tôm đất thiên nhiên ăn các sinh vật phù du sông nước nên thớ thịt dầy đặc, d dào đạm và có vị ngọt đậm cực kỳ đặc trưng không thể nhầm lẫn. Từ nguyên liệu tuyệt vời đó, Gnod Food đã chế biến nên dòng sản phẩm quý tộc phục vụ mọi bữa tiệc sành điệu.",
      "Quy trình sản xuất ra mẻ tôm khô đất của Gnod Food là cả một nghệ thuật ẩm thực đòi hỏi tính tỉ mỉ tuyệt đói của nghệ nhân truyền thống. Tôm đất sau khi được đánh bắt bằng đăng, lú thủ công sẽ được tuyển chọn kích cỡ đồng đều ráo nước, hấp chín ngay trong nồi nước muối biển tinh khiết súc sôi nhẹ theo tỷ lệ gia truyền nhà Gnod. Thao tác luộc canh chỉnh nhiệt độ chính xác từng giây là điều quyết định giúp thớ tôm giữ nguyên sắc đỏ cam hổ phách lấp lánh tự nhiên rực rỡ mà không cần bất cứ giọt phẩm màu nhân tạo nào.",
      "Sau khi lột vỏ cẩn thận thủ công để tránh rách thịt dập mình, tôm đất tiếp tục trải quả quy trình phơi sấy chậm sinh học gián tiếp độc quyền. Điều này giúp dứt điểm độ ẩm lý tưởng 12%, khóa chặt phân tử ngọt tự nhiên sâu bên trong sớ tôm dai giòn sần sật bùi béo. Tôm khô đạt tiêu chuẩn vàng nhà Gnod dứt khoát không có mùi tanh nồng hôi của tôm chết ngâm lâu, mút nhẹ cảm giác dịu ngọt lan tỏa ngay đầu lưỡi, rất phù hợp nếm ăn chơi trực tiếp hay kết đôi cùng tôm mực khô hải sản vũng tàu làm phong phú thêm mâm cơm truyền thống ấm cúng.",
      "Để thưởng thức món tôm siêu hạng sạch bóng an toàn tuyệt đối, quý khách có thể liên hệ trực tiếp đến các showroom trực thuộc hệ thống bán lẻ Gnod Food - địa chỉ bán khô hải sản uy tín hàng đầu hiện nay. Chúng tôi sẵn sàng hỗ trợ đóng hũ sang trọng Ceramic dán tem cam kết bảo hành chất lượng 1 đổi 1 tận tâm."
    ]
  },
  {
    id: "dinh-duong-ca-duoi-nghe",
    title: "Giá trị dinh dưỡng của khô cá đuối nghệ ngon giòn bồi bổ xương khớp",
    summary: "Ăn khô cá đuối đen có tốt không? Khám phá nguồn khoáng chất vượt trội và gelatin dồi dào có trong lớp sụn giòn tan sần sật của khô cá đuối nghệ. Phù hợp cho chế độ ăn uống lành mạnh và làm đẹp da.",
    date: "02/06/2026",
    author: "Gnod Food",
    readTime: "4 phút",
    category: "Sức khỏe ẩm thực",
    image: stingrayVungtauBanner,
    tags: ["Khô Cá Đuối", "Dinh Dưỡng Sạch", "Bồi Bổ Sức Khỏe"],
    primaryKeywords: ["khô cá đuối mắm me", "khô hải sản vũng tàu", "cách nướng khô cá đuối ngon"],
    secondaryKeywords: ["sụn cá đuối giàu canxi", "quà biếu gia đình", "món ăn lành mạnh"],
    content: [
      "Trong suy nghĩ của nhiều người tiêu dùng thông thường, các dòng mồi nhậu khô hải sản vũng tàu thường chỉ thích hợp làm món ăn chơi ngẫu hứng chứ ít có giá trị dinh dưỡng thiết thực. Tuy nhiên, các nghiên cứu khoa học thực dưỡng mới đây đã chứng minh điều hoàn toàn ngược lại, đặc biệt là đối với dòng khô cá đuối mắm me thượng hạng của chúng tôi. Cá đuối nghệ hay cá đuối đen là sinh vật biển sâu khơi dồi dào canxi hữu cơ, đạm nạc tinh khiết cùng lượng chất béo bão hòa cực kỳ thấp.",
      "Điểm đặc sắc nhất của s thịt khô cá đuối đen chính là lớp cấu trúc sụn mỏng mềm dẻo chạy dọc cơ thể cá. Khi nướng sém cạnh thơm giòn rụm, sụn cá đuối nhai sần sật giòn giã rất vui tai và ngậy vị. Chất sụn này chứa hàm lượng chondroitin sulfate cùng glucosamine tự nhiên vô cùng dồi dào - đây là hai dưỡng chất vàng quý hiếm đóng vai trò tái tạo mô sụn khớp khớp gối, tăng cường dịch bôi trơn giảm thiểu các cơn đau mỏi xương khớp ở người trung niên và cao tuổi rất hiệu quả.",
      "Đối với phái đẹp yêu thích chế độ ăn kiêng thanh lọc cơ thể (Eat Clean / Keto), thớ thịt khô cá nghệ nướng sấy nhà Gnod Food là giải pháp cứu cánh tuyệt vời cho những bữa ăn phụ buổi chiều xế bóng. Cứ 100g thịt khô cá đuối nghệ cung cấp đến hơn 65g protein sạch hấp thụ nhanh cùng nguồn phốt pho, kali, selen quý hiếm giúp tăng cường miễn dịch săn chắc cơ bắp săn dẻo tươi tắn mà hoàn toàn không tích trữ lượng mỡ thừa tích tụ trong cơ thể.",
      "Khi học được cách nướng khô cá đuối ngon cùng mắm me chua ngọt sánh dẻo dính không có hương liệu hóa học, bạn đã có một đĩa mồi vừa tốt cho tiêu hóa, bồi bổ năng lượng lại cực thơm lừng sang quý. Hãy trân trọng chăm sóc những người thân yêu bằng dòng sản phẩm sạch, cao cấp tự nhiên trao tay từ Gnod Food."
    ]
  },
  {
    id: "giai-ma-thuong-hieu-gnod-food",
    title: "Tìm địa chỉ bán khô hải sản uy tín chất lượng - Cam kết Gnod Food sạch 100%",
    summary: "Thị trường khô mực cá thật giả lẫn lộn cùng các chất tẩy trắng bảo quản độc hại gây ung thư. Tìm hiểu tiêu chuẩn an toàn thực phẩm cực đoan 4 KHÔNG tạo nên uy tín đỉnh cao của Gnod Food.",
    date: "12/06/2026",
    author: "CEO Gnod Food",
    readTime: "5 phút",
    category: "Câu chuyện thương hiệu",
    image: stingrayMameBanner,
    tags: ["Cam Kết Sạch", "Gnod Food", "Uy Tín Hàng Đầu"],
    primaryKeywords: ["địa chỉ bán khô hải sản uy tín", "khô hải sản vũng tàu", "khô cá đuối mắm me"],
    secondaryKeywords: ["khô mực câu thượng hạng", "quà biếu cao cấp", "tiêu chuẩn sạch an toàn"],
    content: [
      "Tại Việt Nam, các món khô hải sản phơi nắng luôn là linh hồn mộc mạc quyến rũ trên mọi bàn nhậu hội họp ấm cúng. Thế nhưng phía sau hương vị béo ngọt lôi cuốn đó lại đang tiềm ẩn những hồi chuông cảnh báo sâu sắc về vệ sinh an toàn thực phẩm. Để tối đa hóa lợi nhuận, không ít cơ sở sản xuất đen đã sử dụng hóa chất tẩy trắng cực độc sulfite để tẩy mực thối, tẩm ướp borax (hàn thê) cực hại hay xịt các hóa chất chống kiến gián hóa học mốc ẩm cực hại cho dạ dày người tiêu dùng.",
      "Thấu hiểu sâu sắc nỗi ám ảnh tiềm ẩn của quý khách hàng, thương hiệu Gnod Food ra đời cùng sứ mệnh thiêng liêng kiến tạo chuẩn mực ẩm thực biển sạch tuyệt đối. Để trở thành địa chỉ bán khô hải sản uy tín số 1 Việt Nam hiện nay, chúng tôi tuân thủ nghiêm ngặt nguyên tắc cốt lõi '4 KHÔNG': Không chất tạo nạc hóa học - Không chất tẩy trắng mốc độc hại - Không tẩm màu nhân tạo - Không hóa chất phụ gia bảo quản độc hại dài ngày.",
      "Toàn bộ nguồn khô hải sản vũng tàu, từ khô cá đuối nghệ bùi ngậy sém sụn giòn đến khô mực câu thượng hạng Phú Quốc đều được thu mua tận gốc bãi thuyền lưới. Hải sản làm sạch hoàn toàn bằng nước muối điện hóa nhẹ sát khuẩn sạch bóng bẩn, vắt ráo ráo nước phơi trên cao để tránh vi khuẩn và bụi cát bay rơi rụng. Quy trình sấy chân không bổ trợ ngăn chặn tối đa nguy cơ dính mốc hay ruồi kiến ẩm ướt tấn công.",
      "Từng gói hàng, chiếc hũ thủy tinh Ceramic trao tặng đến người sành ăn xa gần đều kết hợp mã QR truy xuất nguồn gốc công khai, rõ ràng. Chúng tôi không chỉ bán ẩm thực đặc sản cao cấp, mà còn đang trao gửi chữ TÂM vững chãi và khát vọng gìn giữ giàn phơi đại dương sạch của tổ tiên bãi Việt. Hãy chọn Gnod Food để an tâm trọn vẹn từng thớ ngọt ngào của thiên nhiên kì diệu mang lại."
    ]
  }
];

