// HiLink physical locations — single source of truth for the Locations
// landing (map + list) and the per-location detail pages.
// `line` = workspace brand line badge (HPW / HBC / HFS).
// mapX / mapY = pin position on the schematic Hanoi SVG (0–100 %).
// coords = [lat, lng] for the real tile map. APPROXIMATE — verify each in
//   Google Maps (right-click the entrance -> click the lat,lng to copy).
//   Locations without `coords` fall back to the address-based Google embed.
// Addresses / phones / hours are mapped from the client sitemap and seeded
// with sensible defaults — confirm against the live directory before launch.

const img = (p) => {
  if (!p) return "";
  let s = p.replace(/^public\//, "");
  if (!s.startsWith("/")) s = "/" + s;
  try { return encodeURI(decodeURI(s)); } catch { return s; }
};

export const WORKSPACE_LINES = {
  HPW: { label: "HiLink Premium Workspace", color: "#A88F5C" },
  HBC: { label: "HiLink Business Club",     color: "#3D4A2E" },
  HFS: { label: "HiLink Flex Spaces",       color: "#8C5A3C" },
};

// Shared amenity definitions — referenced by key from each location.
export const AMENITIES = {
  wifi:      { icon: "wifi",      label: { en: "1 Gbps Fibre Wi-Fi",   vi: "Wi-Fi cáp quang 1 Gbps" } },
  coffee:    { icon: "coffee",    label: { en: "Barista Coffee Bar",   vi: "Quầy cà phê barista" } },
  reception: { icon: "reception", label: { en: "Staffed Reception",    vi: "Lễ tân trực" } },
  meeting:   { icon: "av",        label: { en: "Meeting Rooms",        vi: "Phòng họp" } },
  phone:     { icon: "phone",     label: { en: "Phone Booths",         vi: "Phòng gọi điện" } },
  printing:  { icon: "printer",   label: { en: "Printing & Scanning",  vi: "In ấn & scan" } },
  parking:   { icon: "parking",   label: { en: "Parking",              vi: "Bãi đỗ xe" } },
  lounge:    { icon: "chair",     label: { en: "Member Lounge",        vi: "Phòng chờ thành viên" } },
  access:    { icon: "key",       label: { en: "24/7 Access",          vi: "Ra vào 24/7" } },
  mail:      { icon: "mail",      label: { en: "Mail Handling",        vi: "Nhận & chuyển thư" } },
  events:    { icon: "users",     label: { en: "Event Space",          vi: "Không gian sự kiện" } },
  climate:   { icon: "bolt",      label: { en: "Climate Control",      vi: "Điều hòa trung tâm" } },
  av:        { icon: "av",        label: { en: "A/V & Video",          vi: "A/V & Hội nghị video" } },
  light:     { icon: "light",     label: { en: "Natural Light",        vi: "Ánh sáng tự nhiên" } },
  lock:      { icon: "lock",      label: { en: "Lockable Storage",     vi: "Tủ khóa riêng" } },
};

const mapsLink = (address) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

export const LOCATIONS = [
  {
    id: "obc", coords: [21.02423, 105.85713], code: "OBC", line: "HBC",
    name: "60 Lý Thái Tổ", district: "Hoàn Kiếm",
    address: "Floor 7, 60 Lý Thái Tổ, Hoàn Kiếm, Hà Nội",
    phone: "+84 24 3936 9197", email: "obc@hilink.vn",
    hours: "Mon–Fri · 08:00–20:00 · Sat 09:00–17:00",
    vacancies: 6, moveIn: "Immediate",
    solutions: ["Private Workspaces", "Corporate Suites", "e-Office"],
    intro: {
      en: "Our flagship Business Club address, steps from Hoàn Kiếm Lake. Floor 7 pairs a members' lounge with private suites and boardrooms for Hanoi's executives.",
      vi: "Địa chỉ Business Club hàng đầu, sát Hồ Hoàn Kiếm. Tầng 7 kết hợp phòng chờ thành viên với suite riêng và phòng họp cho giới điều hành Hà Nội.",
    },
    amenityKeys: ["wifi", "coffee", "reception", "meeting", "lounge", "access", "printing", "climate"],
    services: [
      { name: "Private Offices",  units: 12, price: { en: "from ₫45m/mo", vi: "từ ₫45tr/tháng" } },
      { name: "Executive Suites", units: 4,  price: { en: "from ₫72m/mo", vi: "từ ₫72tr/tháng" } },
      { name: "Boardrooms",       units: 3,  price: { en: "from ₫350k/hr", vi: "từ ₫350k/giờ" } },
      { name: "e-Office Plans",   units: 99, price: { en: "from ₫299k/mo", vi: "từ ₫299k/tháng" } },
    ],
    floorPlan: null,
    img: img("/mid/DSC05831(1).jpg.webp"),
    gallery: ["/mid/Lounge 2 copy.jpg.webp", "/mid/DSC05831(1).jpg.webp", "/mid/DSC06104.jpg.webp", "/mid/Meeting room 6 copy.jpg.webp", "/mid/Cabin 2 copy.jpg.webp"].map(img),
    directions: [
      { mode: "Walk",  text: { en: "3 min from Hoàn Kiếm Lake",       vi: "3 phút từ Hồ Hoàn Kiếm" } },
      { mode: "Drive", text: { en: "10 min from the Old Quarter",     vi: "10 phút từ Phố Cổ" } },
      { mode: "Bus",   text: { en: "Routes 09, 14, 36 nearby",        vi: "Tuyến 09, 14, 36 gần đó" } },
    ],
    mapX: 62, mapY: 40,
  },
  {
    id: "nha-chung", coords: [21.02869, 105.84876], code: "NC35", line: "HPW",
    name: "35 Nhà Chung", district: "Hoàn Kiếm",
    address: "35 Nhà Chung, Hoàn Kiếm, Hà Nội",
    phone: "+84 24 3936 9101", email: "nhachung@hilink.vn",
    hours: "Mon–Fri · 08:00–19:00",
    vacancies: 4, moveIn: "Immediate",
    solutions: ["Private Workspaces", "Hybrid Work"],
    intro: {
      en: "A boutique workspace tucked beside St. Joseph's Cathedral. Quiet private offices and flexible desks for small, design-minded teams.",
      vi: "Không gian boutique nép bên Nhà thờ Lớn. Văn phòng riêng yên tĩnh và bàn linh hoạt cho các đội nhỏ yêu thiết kế.",
    },
    amenityKeys: ["wifi", "coffee", "reception", "phone", "printing", "access"],
    services: [
      { name: "Private Offices", units: 6,  price: { en: "from ₫38m/mo", vi: "từ ₫38tr/tháng" } },
      { name: "Flex Desks",      units: 18, price: { en: "from ₫2.5m/mo", vi: "từ ₫2.5tr/tháng" } },
      { name: "Hot Desks",       units: 12, price: { en: "from ₫89k/hr", vi: "từ ₫89k/giờ" } },
    ],
    floorPlan: null,
    img: img("/mid/DSC06008.jpg.webp"),
    gallery: ["/mid/DSC06008.jpg.webp", "/mid/DSC05749.jpg.webp", "/mid/DSC05997.jpg.webp", "/mid/Lounge 9 copy.jpg.webp"].map(img),
    directions: [
      { mode: "Walk",  text: { en: "1 min from St. Joseph's Cathedral", vi: "1 phút từ Nhà thờ Lớn" } },
      { mode: "Drive", text: { en: "8 min from Hoàn Kiếm Lake",          vi: "8 phút từ Hồ Hoàn Kiếm" } },
    ],
    mapX: 56, mapY: 48,
  },
  {
    id: "pp83", coords: [21.02251, 105.84651], code: "PP83", line: "HPW",
    name: "83 Lý Thường Kiệt", district: "Hoàn Kiếm",
    address: "Floor 7, 83 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội",
    phone: "+84 24 3936 9102", email: "pp83@hilink.vn",
    hours: "Mon–Fri · 07:30–21:00 · Sat 09:00–17:00",
    vacancies: 9, moveIn: "Jul 2026",
    solutions: ["Private Workspaces", "Corporate Suites", "Hybrid Work"],
    intro: {
      en: "A full-floor workspace on Hanoi's diplomatic corridor. Generous private offices, recurring meeting rooms, and a hybrid lounge for visiting teams.",
      vi: "Không gian trọn tầng trên trục ngoại giao của Hà Nội. Văn phòng riêng rộng rãi, phòng họp định kỳ và lounge hybrid cho đội ngũ công tác.",
    },
    amenityKeys: ["wifi", "coffee", "reception", "meeting", "phone", "printing", "parking", "access"],
    services: [
      { name: "Private Offices", units: 16, price: { en: "from ₫42m/mo", vi: "từ ₫42tr/tháng" } },
      { name: "Meeting Rooms",   units: 5,  price: { en: "from ₫280k/hr", vi: "từ ₫280k/giờ" } },
      { name: "HyFlex Desks",    units: 24, price: { en: "from ₫3m/mo", vi: "từ ₫3tr/tháng" } },
    ],
    floorPlan: null,
    img: img("/mid/L1001039.jpg.webp"),
    gallery: ["/mid/L1001039.jpg.webp", "/mid/DSC05809.jpg.webp", "/mid/DSC06198.jpg.webp", "/mid/Meeting room 4  (1).jpg.webp"].map(img),
    directions: [
      { mode: "Walk",  text: { en: "5 min from Hanoi Opera House", vi: "5 phút từ Nhà hát Lớn" } },
      { mode: "Drive", text: { en: "6 min from Hoàn Kiếm Lake",     vi: "6 phút từ Hồ Hoàn Kiếm" } },
      { mode: "Bus",   text: { en: "Routes 08, 31, 49 nearby",      vi: "Tuyến 08, 31, 49 gần đó" } },
    ],
    mapX: 52, mapY: 56,
  },
  {
    id: "nq49", coords: [21.02470, 105.85520], code: "NQ49", line: "HFS",
    name: "49 Ngô Quyền", district: "Hoàn Kiếm",
    address: "49 Ngô Quyền, Hoàn Kiếm, Hà Nội",
    phone: "+84 24 3936 9103", email: "nq49@hilink.vn",
    hours: "Mon–Sat · 08:00–20:00",
    vacancies: 3, moveIn: "Aug 2026",
    solutions: ["Hybrid Work", "Specialized Suites"],
    intro: {
      en: "A flexible studio address built for creators. Specialized media and design suites alongside roam-anywhere hybrid memberships.",
      vi: "Địa chỉ studio linh hoạt cho người sáng tạo. Suite chuyên biệt cho media và thiết kế, cùng gói hybrid linh hoạt.",
    },
    amenityKeys: ["wifi", "coffee", "phone", "printing", "lounge", "events", "access"],
    services: [
      { name: "Media Suites",     units: 3,  price: { en: "from ₫55m/mo", vi: "từ ₫55tr/tháng" } },
      { name: "Creative Studios", units: 4,  price: { en: "from ₫48m/mo", vi: "từ ₫48tr/tháng" } },
      { name: "HyFlex Roam",      units: 99, price: { en: "from ₫1.8m/mo", vi: "từ ₫1.8tr/tháng" } },
    ],
    floorPlan: null,
    img: img("/mid/DSC05955(1).jpg.webp"),
    gallery: ["/mid/DSC05955(1).jpg.webp", "/mid/Cabin 2 copy.jpg.webp", "/mid/Locker 1.jpg.webp", "/mid/DSC06104.jpg.webp"].map(img),
    directions: [
      { mode: "Walk",  text: { en: "4 min from Hanoi Opera House", vi: "4 phút từ Nhà hát Lớn" } },
      { mode: "Drive", text: { en: "7 min from the Old Quarter",   vi: "7 phút từ Phố Cổ" } },
    ],
    mapX: 66, mapY: 52,
  },
  {
    id: "ttt-f15", coords: [21.00043, 105.82881], code: "CNC15", line: "HPW",
    name: "4 Tôn Thất Tùng · Floor 15", district: "Đống Đa",
    address: "Floor 15, 4 Tôn Thất Tùng, Đống Đa, Hà Nội",
    phone: "+84 24 3936 9111", email: "ttt15@hilink.vn",
    hours: "Mon–Fri · 08:00–20:00",
    vacancies: 8, moveIn: "Immediate",
    solutions: ["Private Workspaces", "Hybrid Work", "Enterprise Solutions"],
    intro: {
      en: "High-floor workspace with skyline views over Đống Đa. Scalable private offices and build-to-suit enterprise floors for growing teams.",
      vi: "Không gian tầng cao với tầm nhìn toàn cảnh Đống Đa. Văn phòng riêng có thể mở rộng và tầng doanh nghiệp build-to-suit cho đội ngũ tăng trưởng.",
    },
    amenityKeys: ["wifi", "coffee", "reception", "meeting", "phone", "printing", "parking", "climate", "access"],
    services: [
      { name: "Private Offices",      units: 20, price: { en: "from ₫40m/mo", vi: "từ ₫40tr/tháng" } },
      { name: "Enterprise Floors",    units: 2,  price: { en: "POA", vi: "Liên hệ báo giá" } },
      { name: "Meeting Rooms",        units: 4,  price: { en: "from ₫300k/hr", vi: "từ ₫300k/giờ" } },
      { name: "HyFlex Memberships",   units: 99, price: { en: "from ₫2.5m/mo", vi: "từ ₫2.5tr/tháng" } },
    ],
    floorPlan: img("/mid/CNN15_FloorPlan.jpg.webp"),
    img: img("/mid/DSC06084(1).jpg.webp"),
    gallery: ["/mid/DSC06084(1).jpg.webp", "/mid/DSC06155(1).jpg.webp", "/mid/Lounge 9 copy.jpg.webp", "/mid/Meeting room 6 copy.jpg.webp"].map(img),
    directions: [
      { mode: "Drive", text: { en: "12 min from Hoàn Kiếm Lake",  vi: "12 phút từ Hồ Hoàn Kiếm" } },
      { mode: "Walk",  text: { en: "6 min from Chùa Bộc",          vi: "6 phút từ Chùa Bộc" } },
      { mode: "Bus",   text: { en: "Routes 26, 35B, 44 nearby",    vi: "Tuyến 26, 35B, 44 gần đó" } },
    ],
    mapX: 30, mapY: 68,
  },
  {
    id: "ttt-f17", coords: [21.00043, 105.82881], code: "CNC17", line: "HPW",
    name: "4 Tôn Thất Tùng · Floor 17", district: "Đống Đa",
    address: "Floor 17, 4 Tôn Thất Tùng, Đống Đa, Hà Nội",
    phone: "+84 24 3936 9112", email: "ttt17@hilink.vn",
    hours: "Mon–Fri · 08:00–20:00",
    vacancies: 5, moveIn: "Immediate",
    solutions: ["Private Workspaces", "Corporate Suites"],
    intro: {
      en: "A calm, full-service floor for established teams — private offices, corporate boardrooms, and a staffed reception two floors above F15.",
      vi: "Một tầng trọn gói yên tĩnh cho đội ngũ ổn định — văn phòng riêng, phòng họp doanh nghiệp và lễ tân trực, ngay trên F15 hai tầng.",
    },
    amenityKeys: ["wifi", "coffee", "reception", "meeting", "printing", "parking", "climate", "access"],
    services: [
      { name: "Private Offices", units: 14, price: { en: "from ₫41m/mo", vi: "từ ₫41tr/tháng" } },
      { name: "Boardrooms",      units: 3,  price: { en: "from ₫350k/hr", vi: "từ ₫350k/giờ" } },
    ],
    floorPlan: null,
    img: img("/mid/DSC06155(1).jpg.webp"),
    gallery: ["/mid/DSC06155(1).jpg.webp", "/mid/DSC06084(1).jpg.webp", "/mid/DSC05749.jpg.webp", "/mid/Lounge 2 copy.jpg.webp"].map(img),
    directions: [
      { mode: "Drive", text: { en: "12 min from Hoàn Kiếm Lake", vi: "12 phút từ Hồ Hoàn Kiếm" } },
      { mode: "Bus",   text: { en: "Routes 26, 35B, 44 nearby",   vi: "Tuyến 26, 35B, 44 gần đó" } },
    ],
    mapX: 32, mapY: 71,
  },
  {
    id: "ttt-f19", coords: [21.00043, 105.82881], code: "CNC19", line: "HBC",
    name: "4 Tôn Thất Tùng · Floor 19", district: "Đống Đa",
    address: "Floor 19, 4 Tôn Thất Tùng, Đống Đa, Hà Nội",
    phone: "+84 24 3936 9113", email: "ttt19@hilink.vn",
    hours: "Mon–Fri · 08:00–21:00",
    vacancies: 2, moveIn: "Sep 2026",
    solutions: ["Corporate Suites", "Specialized Suites", "Enterprise Solutions"],
    intro: {
      en: "The top-floor Business Club for Đống Đa — premium lounge, specialized suites, and dedicated managed offices with the building's best views.",
      vi: "Business Club tầng cao nhất cho Đống Đa — lounge cao cấp, suite chuyên biệt và văn phòng quản lý riêng với tầm nhìn đẹp nhất tòa nhà.",
    },
    amenityKeys: ["wifi", "coffee", "reception", "meeting", "lounge", "events", "parking", "climate", "access"],
    services: [
      { name: "Specialized Suites",       units: 4, price: { en: "from ₫58m/mo", vi: "từ ₫58tr/tháng" } },
      { name: "Dedicated Managed Office", units: 2, price: { en: "POA", vi: "Liên hệ báo giá" } },
      { name: "Club Lounge Access",       units: 99, price: { en: "from ₫4m/mo", vi: "từ ₫4tr/tháng" } },
    ],
    floorPlan: null,
    img: img("/mid/Lounge 9 copy.jpg.webp"),
    gallery: ["/mid/Lounge 9 copy.jpg.webp", "/mid/Lounge 2 copy.jpg.webp", "/mid/DSC06104.jpg.webp", "/mid/Meeting room 4  (1).jpg.webp"].map(img),
    directions: [
      { mode: "Drive", text: { en: "12 min from Hoàn Kiếm Lake", vi: "12 phút từ Hồ Hoàn Kiếm" } },
      { mode: "Walk",  text: { en: "6 min from Chùa Bộc",         vi: "6 phút từ Chùa Bộc" } },
    ],
    mapX: 34, mapY: 74,
  },
].map(l => ({ ...l, mapsUrl: mapsLink(l.address) }));

export const DISTRICTS = [...new Set(LOCATIONS.map(l => l.district))];
export const ALL_SOLUTIONS = [...new Set(LOCATIONS.flatMap(l => l.solutions))];
export const MOVE_IN_OPTIONS = ["Immediate", "Within 1 month", "Within 3 months", "Flexible"];

export const getLocation = (id) => LOCATIONS.find(l => l.id === id) || null;

/* ── Available Units (image 4 reference) ───────────────────────────────
   Auto-attached to every location, derived from its floor + gallery.     */
const _img = (p) => { if (!p) return ""; let s = String(p).replace(/^public\//, ""); if (!s.startsWith("/")) s = "/" + s; try { return encodeURI(decodeURI(s)); } catch { return s; } };

const UNIT_PRESETS = [
  { area: 120, seats: 36, status: { en: "Available now", vi: "Còn trống" }, price: { en: "₫85,000,000 / mo", vi: "₫85.000.000 / tháng" },
    desc: { en: "A full-corner suite with panoramic city views, a private meeting room, and a breakout area — fitted, furnished, and move-in ready.", vi: "Suite góc trọn với tầm nhìn toàn cảnh, phòng họp riêng và khu breakout — đã thi công, nội thất đầy đủ, sẵn sàng vào ở." } },
  { area: 62, seats: 24, status: { en: "Available now", vi: "Còn trống" }, price: { en: "₫52,000,000 / mo", vi: "₫52.000.000 / tháng" },
    desc: { en: "A bright private office for a growing team, with floor-to-ceiling glazing and direct access to shared amenities.", vi: "Văn phòng riêng sáng sủa cho đội ngũ đang phát triển, kính từ sàn đến trần và lối vào tiện ích chung." } },
  { area: 45, seats: 18, status: { en: "Available now", vi: "Còn trống" }, price: { en: "₫38,000,000 / mo", vi: "₫38.000.000 / tháng" },
    desc: { en: "A lockable office sized for a focused team, fully furnished with ergonomic desks and storage.", vi: "Văn phòng có khoá cho đội ngũ tập trung, nội thất đầy đủ với bàn ergonomic và tủ lưu trữ." } },
  { area: 28, seats: 8, status: { en: "Available Apr 2026", vi: "Trống từ 04/2026" }, price: { en: "₫24,000,000 / mo", vi: "₫24.000.000 / tháng" },
    desc: { en: "An intimate suite ideal for a founding team or a satellite office, with everything included.", vi: "Suite ấm cúng lý tưởng cho đội sáng lập hoặc văn phòng vệ tinh, bao trọn mọi thứ." } },
];

LOCATIONS.forEach((loc) => {
  const fm = (loc.address && loc.address.match(/Floor\s+(\d+)/i)) || (loc.name && loc.name.match(/F(\d+)/i));
  const floor = fm ? parseInt(fm[1], 10) : 7;
  const g = (loc.gallery && loc.gallery.length ? loc.gallery : [loc.img]).map(_img);
  loc.units = UNIT_PRESETS.map((u, i) => {
    const num = `${floor}${String(i + 1).padStart(2, "0")}`;
    return {
      ...u, id: num, number: num, floor,
      img: g[i % g.length],
      gallery: [g[i % g.length], ...g.filter((_, idx) => idx !== i % g.length)].slice(0, 5),
    };
  });
});

export const getUnit = (locId, unitId) => {
  const loc = getLocation(locId);
  if (!loc) return null;
  const unit = (loc.units || []).find((u) => u.id === unitId);
  return unit ? { loc, unit } : null;
};
