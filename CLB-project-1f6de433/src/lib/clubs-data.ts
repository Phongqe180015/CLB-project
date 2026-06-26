export type ClubCategory =
  | "Thể thao"
  | "Nghệ thuật"
  | "Tình nguyện"
  | "Học thuật"
  | "Công nghệ";

export interface Club {
  id: string;
  name: string;
  fullName: string;
  category: ClubCategory;
  description: string;
  createdBy: string;
  president: string;
  fanpage: string;
  members: number;
  highlights: string[];
  emoji: string;
  tone: string;
}

export const clubCategories: ClubCategory[] = [
  "Thể thao",
  "Nghệ thuật",
  "Tình nguyện",
  "Học thuật",
  "Công nghệ",
];

export const clubs: Club[] = [
  {
    id: "cl1",
    name: "CLB Bóng Rổ",
    fullName: "Câu lạc bộ Bóng Rổ Sinh Viên",
    category: "Thể thao",
    description: "Sân chơi rèn luyện thể lực và tinh thần đồng đội cho những ai đam mê bóng rổ.",
    createdBy: "Nguyễn Minh Anh",
    president: "Trần Quốc Bảo",
    fanpage: "fb.com/clb.bongro",
    members: 64,
    highlights: ["Vô địch giải Liên trường 2024", "Giao hữu hàng tuần", "Đào tạo cơ bản cho tân binh"],
    emoji: "🏀",
    tone: "bg-orange-100 text-orange-600",
  },
  {
    id: "cl2",
    name: "CLB Âm Nhạc",
    fullName: "Câu lạc bộ Âm Nhạc & Biểu Diễn",
    category: "Nghệ thuật",
    description: "Nơi hội tụ những tâm hồn yêu ca hát, nhạc cụ và sân khấu biểu diễn.",
    createdBy: "Lê Thị Cẩm",
    president: "Lê Thị Cẩm",
    fanpage: "fb.com/clb.amnhac",
    members: 88,
    highlights: ["Đêm nhạc Acoustic thường niên", "Lớp guitar miễn phí", "Band biểu diễn sự kiện trường"],
    emoji: "🎸",
    tone: "bg-purple-100 text-purple-600",
  },
  {
    id: "cl3",
    name: "CLB Thiện Nguyện",
    fullName: "Câu lạc bộ Tình Nguyện Vì Cộng Đồng",
    category: "Tình nguyện",
    description: "Lan tỏa yêu thương qua các chương trình thiện nguyện và hoạt động xã hội.",
    createdBy: "Nguyễn Minh Anh",
    president: "Vũ Gia Khánh",
    fanpage: "fb.com/clb.thiennguyen",
    members: 120,
    highlights: ["Mùa hè xanh", "Hiến máu nhân đạo", "Trao quà vùng cao"],
    emoji: "🤝",
    tone: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "cl4",
    name: "CLB Tiếng Anh",
    fullName: "Câu lạc bộ Tiếng Anh Học Thuật",
    category: "Học thuật",
    description: "Cải thiện kỹ năng giao tiếp tiếng Anh qua các buổi thảo luận và hùng biện.",
    createdBy: "Đỗ Thu Hà",
    president: "Đỗ Thu Hà",
    fanpage: "fb.com/clb.tienganh",
    members: 95,
    highlights: ["English Speaking Club hàng tuần", "Cuộc thi hùng biện", "Workshop luyện thi IELTS"],
    emoji: "💬",
    tone: "bg-sky-100 text-sky-600",
  },
  {
    id: "cl5",
    name: "CLB Lập Trình",
    fullName: "Câu lạc bộ Công Nghệ & Lập Trình",
    category: "Công nghệ",
    description: "Cộng đồng đam mê công nghệ, cùng nhau học lập trình và xây dựng dự án.",
    createdBy: "Hồ Bảo Linh",
    president: "Hồ Bảo Linh",
    fanpage: "fb.com/clb.laptrinh",
    members: 78,
    highlights: ["Hackathon nội bộ", "Khoá học Web & AI", "Mentor 1-1 cho thành viên mới"],
    emoji: "💻",
    tone: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "cl6",
    name: "CLB Nhiếp Ảnh",
    fullName: "Câu lạc bộ Nhiếp Ảnh & Truyền Thông",
    category: "Nghệ thuật",
    description: "Ghi lại những khoảnh khắc đẹp và phát triển tư duy thẩm mỹ hình ảnh.",
    createdBy: "Phạm Hoàng Dũng",
    president: "Phạm Hoàng Dũng",
    fanpage: "fb.com/clb.nhiepanh",
    members: 52,
    highlights: ["Triển lãm ảnh thường niên", "Photowalk cuối tuần", "Workshop chỉnh sửa ảnh"],
    emoji: "📷",
    tone: "bg-rose-100 text-rose-600",
  },
  {
    id: "cl7",
    name: "CLB Bóng Đá",
    fullName: "Câu lạc bộ Bóng Đá Sinh Viên",
    category: "Thể thao",
    description: "Tập luyện, thi đấu và xây dựng tinh thần thể thao fair-play.",
    createdBy: "Ngô Tuấn Minh",
    president: "Ngô Tuấn Minh",
    fanpage: "fb.com/clb.bongda",
    members: 70,
    highlights: ["Giải bóng đá nội bộ", "Tập luyện 2 buổi/tuần", "Giao hữu với các trường bạn"],
    emoji: "⚽",
    tone: "bg-green-100 text-green-600",
  },
  {
    id: "cl8",
    name: "CLB Khởi Nghiệp",
    fullName: "Câu lạc bộ Khởi Nghiệp & Kinh Doanh",
    category: "Học thuật",
    description: "Khơi nguồn ý tưởng kinh doanh và rèn luyện tư duy khởi nghiệp cho sinh viên.",
    createdBy: "Nguyễn Minh Anh",
    president: "Nguyễn Minh Anh",
    fanpage: "fb.com/clb.khoinghiep",
    members: 60,
    highlights: ["Cuộc thi ý tưởng kinh doanh", "Talkshow với doanh nhân", "Mentoring dự án"],
    emoji: "🚀",
    tone: "bg-amber-100 text-amber-600",
  },
];
