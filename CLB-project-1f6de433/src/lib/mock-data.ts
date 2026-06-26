// Centralized mock data for the Club ERP UI (frontend prototype)

export type TaskStatus = "todo" | "progress" | "review" | "done";

export interface Member {
  id: string;
  name: string;
  initials: string;
  studentId: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  joinedAt: string;
  points: number;
  fundPaid: boolean;
  major: string;
  motto: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  assigneeInitials: string;
  due: string;
  event: string;
  priority: "Cao" | "Trung bình" | "Thấp";
  department: string;
  points: number;
}

export const departments = [
  "Ban Chủ nhiệm",
  "Ban Truyền thông",
  "Ban Chuyên môn",
  "Ban Hậu cần",
  "Ban Đối ngoại",
];

export const members: Member[] = [
  { id: "1", name: "Nguyễn Minh Anh", initials: "MA", studentId: "SV2021045", department: "Ban Chủ nhiệm", role: "Chủ nhiệm", email: "minhanh@club.edu.vn", phone: "0901 234 567", joinedAt: "09/2021", points: 980, fundPaid: true, major: "Quản trị Kinh doanh", motto: "Dẫn dắt bằng sự tử tế và kỷ luật." },
  { id: "2", name: "Trần Quốc Bảo", initials: "QB", studentId: "SV2021132", department: "Ban Chuyên môn", role: "Trưởng ban", email: "quocbao@club.edu.vn", phone: "0902 345 678", joinedAt: "09/2021", points: 910, fundPaid: true, major: "Khoa học Máy tính", motto: "Chuyên môn vững, kết quả bền." },
  { id: "3", name: "Lê Thị Cẩm", initials: "TC", studentId: "SV2022088", department: "Ban Truyền thông", role: "Trưởng ban", email: "thicam@club.edu.vn", phone: "0903 456 789", joinedAt: "10/2022", points: 875, fundPaid: false, major: "Thiết kế Đồ hoạ", motto: "Sáng tạo mỗi ngày, lan toả mỗi giờ." },
  { id: "4", name: "Phạm Hoàng Dũng", initials: "HD", studentId: "SV2022201", department: "Ban Hậu cần", role: "Thành viên", email: "hoangdung@club.edu.vn", phone: "0904 567 890", joinedAt: "10/2022", points: 720, fundPaid: true, major: "Logistics & Chuỗi cung ứng", motto: "Hậu cần chắc, sự kiện thành công." },
  { id: "5", name: "Đỗ Thu Hà", initials: "TH", studentId: "SV2023015", department: "Ban Truyền thông", role: "Thành viên", email: "thuha@club.edu.vn", phone: "0905 678 901", joinedAt: "09/2023", points: 690, fundPaid: false, major: "Báo chí Truyền thông", motto: "Kể câu chuyện đáng nhớ." },
  { id: "6", name: "Vũ Gia Khánh", initials: "GK", studentId: "SV2023077", department: "Ban Đối ngoại", role: "Trưởng ban", email: "giakhanh@club.edu.vn", phone: "0906 789 012", joinedAt: "09/2023", points: 660, fundPaid: true, major: "Quan hệ Quốc tế", motto: "Kết nối tạo nên cơ hội." },
  { id: "7", name: "Hồ Bảo Linh", initials: "BL", studentId: "SV2023110", department: "Ban Chuyên môn", role: "Thành viên", email: "baolinh@club.edu.vn", phone: "0907 890 123", joinedAt: "10/2023", points: 540, fundPaid: true, major: "Hệ thống Thông tin", motto: "Tỉ mỉ trong từng chi tiết." },
  { id: "8", name: "Ngô Tuấn Minh", initials: "TM", studentId: "SV2024009", department: "Ban Hậu cần", role: "Thành viên", email: "tuanminh@club.edu.vn", phone: "0908 901 234", joinedAt: "09/2024", points: 430, fundPaid: false, major: "Tài chính - Ngân hàng", motto: "Học hỏi không ngừng." },
];

export const tasks: Task[] = [
  { id: "t1", title: "Lên kịch bản chương trình Year End Party", description: "Soạn timeline chi tiết và phân vai MC.", status: "todo", assignee: "Trần Quốc Bảo", assigneeInitials: "QB", due: "25/06", event: "Year End Party", priority: "Cao", department: "Ban Chuyên môn", points: 200 },
  { id: "t2", title: "Thiết kế poster tuyển thành viên", description: "Bộ ảnh chuẩn brand cho fanpage.", status: "todo", assignee: "Lê Thị Cẩm", assigneeInitials: "TC", due: "23/06", event: "Tuyển quân K2024", priority: "Cao", department: "Ban Truyền thông", points: 150 },
  { id: "t3", title: "Liên hệ nhà tài trợ địa điểm", description: "Gọi 3 đối tác tiềm năng.", status: "todo", assignee: "Vũ Gia Khánh", assigneeInitials: "GK", due: "28/06", event: "Year End Party", priority: "Trung bình", department: "Ban Đối ngoại", points: 120 },
  { id: "t4", title: "Viết content 5 bài đăng tuần", description: "Lịch đăng bài fanpage tuần 25.", status: "progress", assignee: "Đỗ Thu Hà", assigneeInitials: "TH", due: "22/06", event: "Truyền thông định kỳ", priority: "Trung bình", department: "Ban Truyền thông", points: 100 },
  { id: "t5", title: "Chuẩn bị âm thanh ánh sáng", description: "Khảo sát thiết bị và báo giá.", status: "progress", assignee: "Phạm Hoàng Dũng", assigneeInitials: "HD", due: "26/06", event: "Year End Party", priority: "Cao", department: "Ban Hậu cần", points: 180 },
  { id: "t6", title: "Tổng hợp đơn ứng tuyển", description: "Lọc CV vòng hồ sơ.", status: "review", assignee: "Hồ Bảo Linh", assigneeInitials: "BL", due: "21/06", event: "Tuyển quân K2024", priority: "Trung bình", department: "Ban Chuyên môn", points: 90 },
  { id: "t7", title: "Dựng video recap sự kiện tháng 5", description: "Edit clip 60s cho fanpage.", status: "review", assignee: "Đỗ Thu Hà", assigneeInitials: "TH", due: "20/06", event: "Truyền thông định kỳ", priority: "Thấp", department: "Ban Truyền thông", points: 80 },
  { id: "t8", title: "Quyết toán quỹ workshop", description: "Tổng hợp hóa đơn và báo cáo.", status: "done", assignee: "Ngô Tuấn Minh", assigneeInitials: "TM", due: "15/06", event: "Workshop Kỹ năng", priority: "Thấp", department: "Ban Hậu cần", points: 70 },
  { id: "t9", title: "Booking khách mời workshop", description: "Đã chốt 2 diễn giả.", status: "done", assignee: "Vũ Gia Khánh", assigneeInitials: "GK", due: "12/06", event: "Workshop Kỹ năng", priority: "Trung bình", department: "Ban Đối ngoại", points: 110 },
];

export const taskColumns: { status: TaskStatus; label: string; tone: string }[] = [
  { status: "todo", label: "Cần làm", tone: "text-muted-foreground" },
  { status: "progress", label: "Đang thực hiện", tone: "text-info" },
  { status: "review", label: "Kiểm tra", tone: "text-orange" },
  { status: "done", label: "Hoàn thành", tone: "text-success" },
];

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  day: number;
  type: "event" | "post" | "deadline";
  progress: number;
  team: string[];
  location: string;
}

export const events: ClubEvent[] = [
  { id: "e1", title: "Year End Party 2025", date: "30/06/2025", day: 30, type: "event", progress: 45, team: ["MA", "QB", "GK", "HD"], location: "Hội trường A" },
  { id: "e2", title: "Tuyển quân khoá 2024", date: "23/06/2025", day: 23, type: "deadline", progress: 70, team: ["TC", "BL", "TH"], location: "Online" },
  { id: "e3", title: "Workshop Kỹ năng mềm", date: "18/06/2025", day: 18, type: "event", progress: 100, team: ["QB", "GK"], location: "Phòng 305" },
  { id: "e4", title: "Đăng bài recap tháng 5", date: "20/06/2025", day: 20, type: "post", progress: 60, team: ["TH", "TC"], location: "Fanpage" },
  { id: "e5", title: "Họp Ban chủ nhiệm tháng 6", date: "15/06/2025", day: 15, type: "event", progress: 100, team: ["MA", "QB", "TC", "HD", "GK"], location: "Phòng họp" },
];

export interface Applicant {
  id: string;
  name: string;
  initials: string;
  studentId: string;
  department: string;
  appliedAt: string;
  status: "pending" | "approved" | "rejected" | "interview";
  motivation: string;
  club?: string;
  phone?: string;
  course?: string;
  major?: string;
  email?: string;
  answers?: { question: string; answer: string }[];
}

export const applicants: Applicant[] = [
  { id: "a1", name: "Bùi Khánh Vy", initials: "KV", studentId: "SV2024112", department: "Ban Truyền thông", appliedAt: "18/06", status: "pending", motivation: "Yêu thích thiết kế và muốn phát triển kỹ năng làm việc nhóm.", answers: [{ question: "Tại sao bạn muốn vào CLB?", answer: "Tôi muốn học cách vận hành truyền thông nội bộ, đồng thời đóng góp bằng khả năng thiết kế và viết nội dung." }, { question: "Điểm mạnh của bạn là gì?", answer: "Tư duy hình ảnh tốt, làm việc có trách nhiệm và phản hồi nhanh với deadline." }, { question: "Bạn sẽ cân bằng học tập và CLB như thế nào?", answer: "Tôi ưu tiên lịch học cố định, sau đó chia đầu việc CLB theo khung giờ buổi tối và cuối tuần." }] },
  { id: "a2", name: "Đặng Anh Tú", initials: "AT", studentId: "SV2024156", department: "Ban Chuyên môn", appliedAt: "18/06", status: "interview", motivation: "Có kinh nghiệm tổ chức sự kiện ở cấp 3.", answers: [{ question: "Bạn có kinh nghiệm liên quan nào?", answer: "Tôi từng phụ trách điều phối hậu trường và checklist vận hành cho 2 sự kiện trường THPT." }, { question: "Khi có xung đột trong nhóm, bạn xử lý ra sao?", answer: "Tôi ưu tiên làm rõ mục tiêu chung, tách vấn đề khỏi cảm xúc và thống nhất bằng dữ liệu thực tế." }, { question: "Bạn muốn học gì nhất khi tham gia?", answer: "Tôi muốn nâng năng lực lập kế hoạch chi tiết và quản lý tiến độ đa đầu việc." }] },
  { id: "a3", name: "Lý Thảo Nhi", initials: "TN", studentId: "SV2024203", department: "Ban Hậu cần", appliedAt: "17/06", status: "pending", motivation: "Muốn học hỏi quy trình tổ chức và quản lý hậu cần.", answers: [{ question: "Bạn phù hợp với ban nào nhất?", answer: "Tôi thích các công việc đòi hỏi sự cẩn thận như kiểm kê, chuẩn bị vật dụng và hỗ trợ sự kiện." }, { question: "Bạn có thể dành bao nhiêu thời gian mỗi tuần?", answer: "Tôi có thể dành 6-8 giờ/tuần, linh hoạt hơn vào giai đoạn sát sự kiện." }, { question: "Bạn kỳ vọng gì ở CLB?", answer: "Tôi muốn được tham gia thực tế để hiểu quy trình và học cách phối hợp với nhiều ban." }] },
  { id: "a4", name: "Trịnh Văn Phúc", initials: "VP", studentId: "SV2024088", department: "Ban Đối ngoại", appliedAt: "16/06", status: "approved", motivation: "Tự tin giao tiếp, kết nối tốt với đối tác.", answers: [{ question: "Bạn từng làm việc với đối tác chưa?", answer: "Tôi từng hỗ trợ liên hệ nhà tài trợ cho một workshop sinh viên và xử lý trao đổi cơ bản qua email." }, { question: "Điểm mạnh nổi bật của bạn là gì?", answer: "Giao tiếp rõ ràng, giữ cam kết tốt và chủ động theo sát tiến độ sau cuộc họp." }, { question: "Bạn sẽ đóng góp gì cho ban?", answer: "Tôi có thể hỗ trợ kết nối, soạn nội dung liên hệ và theo dõi phản hồi từ đối tác." }] },
  { id: "a5", name: "Hoàng Mai Chi", initials: "MC", studentId: "SV2024199", department: "Ban Truyền thông", appliedAt: "16/06", status: "rejected", motivation: "Thích viết content và quản lý fanpage." },
  { id: "a6", name: "Phan Đức Long", initials: "ĐL", studentId: "SV2024045", department: "Ban Chuyên môn", appliedAt: "15/06", status: "pending", motivation: "Đam mê chuyên môn, sẵn sàng cống hiến." },
];

export interface Document {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "XLSX";
  category: string;
  term: string;
  size: string;
  status: "Đã thực hiện" | "Ý tưởng" | "Lưu trữ";
  updatedAt: string;
}

export const documents: Document[] = [
  { id: "d1", name: "Kế hoạch Year End Party 2025", type: "DOCX", category: "Sự kiện", term: "2024-2025", size: "2.4 MB", status: "Đã thực hiện", updatedAt: "10/06/2025" },
  { id: "d2", name: "Đề án tuyển quân khoá 2024", type: "PDF", category: "Tuyển dụng", term: "2024-2025", size: "1.1 MB", status: "Đã thực hiện", updatedAt: "05/06/2025" },
  { id: "d3", name: "Ý tưởng Triển lãm nghệ thuật", type: "DOCX", category: "Sự kiện", term: "2024-2025", size: "850 KB", status: "Ý tưởng", updatedAt: "01/06/2025" },
  { id: "d4", name: "Báo cáo tổng kết kỳ I", type: "PDF", category: "Báo cáo", term: "2023-2024", size: "3.2 MB", status: "Lưu trữ", updatedAt: "20/01/2025" },
  { id: "d5", name: "Bảng quyết toán quỹ workshop", type: "XLSX", category: "Tài chính", term: "2024-2025", size: "540 KB", status: "Đã thực hiện", updatedAt: "16/06/2025" },
  { id: "d6", name: "Kịch bản Gala kỷ niệm 5 năm", type: "DOCX", category: "Sự kiện", term: "2022-2023", size: "1.8 MB", status: "Lưu trữ", updatedAt: "12/2022" },
  { id: "d7", name: "Ý tưởng chuỗi podcast nội bộ", type: "DOCX", category: "Truyền thông", term: "2024-2025", size: "420 KB", status: "Ý tưởng", updatedAt: "28/05/2025" },
];

export interface Term {
  term: string;
  president: string;
  initials: string;
  vicePresidents: string[];
  highlight: string;
}

export const lineage: Term[] = [
  { term: "Nhiệm kỳ V (2024-2025)", president: "Nguyễn Minh Anh", initials: "MA", vicePresidents: ["Trần Quốc Bảo", "Lê Thị Cẩm"], highlight: "Số hoá toàn bộ quy trình quản lý câu lạc bộ." },
  { term: "Nhiệm kỳ IV (2023-2024)", president: "Đặng Hải Yến", initials: "HY", vicePresidents: ["Nguyễn Minh Anh", "Phạm Hoàng Dũng"], highlight: "Mở rộng quy mô lên 120 thành viên." },
  { term: "Nhiệm kỳ III (2022-2023)", president: "Lê Quang Huy", initials: "QH", vicePresidents: ["Đặng Hải Yến", "Vũ Thuỳ Trang"], highlight: "Tổ chức Gala kỷ niệm 5 năm thành lập." },
  { term: "Nhiệm kỳ II (2021-2022)", president: "Trương Khả Ngân", initials: "KN", vicePresidents: ["Lê Quang Huy"], highlight: "Xây dựng bộ nhận diện thương hiệu đầu tiên." },
  { term: "Nhiệm kỳ I (2020-2021)", president: "Mai Đức Thắng", initials: "ĐT", vicePresidents: ["Trương Khả Ngân"], highlight: "Sáng lập câu lạc bộ với 25 thành viên." },
];

export interface FundRecord {
  member: string;
  initials: string;
  department: string;
  q1: boolean;
  q2: boolean;
  event: boolean;
}

export const fundRecords: FundRecord[] = members.map((m, i) => ({
  member: m.name,
  initials: m.initials,
  department: m.department,
  q1: true,
  q2: m.fundPaid,
  event: i % 3 !== 0,
}));
