// Six Solutions pages (sitemap rows 26–65), data-driven so one <SolutionPage>
// renderer covers them all. Each page = hero + ordered `sections`.
// Section types: offering | benefits | findLocations | packages | caseStudy |
// customers | enquiryForm. The trailing "Other solutions" block is generated
// from `other` slugs. Amenity icons are shared from locations.js (AMENITIES).
import { AMENITIES } from "./locations.js";

const img = (p) => {
  if (!p) return "";
  let s = p.replace(/^public\//, "");
  if (!s.startsWith("/")) s = "/" + s;
  try { return encodeURI(decodeURI(s)); } catch { return s; }
};

export { AMENITIES };

// slug → display label, used for the dropdown, cross-links and the index grid.
export const SOLUTION_INDEX = [
  { slug: "private-workspaces", label: "Private Workspaces" },
  { slug: "hybrid-work",        label: "Hybrid Work" },
  { slug: "e-office",           label: "e-Office" },
  { slug: "corporate-suites",   label: "Corporate Suites" },
  { slug: "specialized-suites", label: "Specialized Suites" },
  { slug: "enterprise",         label: "Enterprise Solutions" },
];

export const SOLUTIONS = {
  /* ───────── Private Workspaces (rows 26–31) ───────── */
  "private-workspaces": {
    slug: "private-workspaces",
    title: "Private Workspaces",
    tagline: { en: "Lockable, fully furnished offices that scale with your team.", vi: "Văn phòng riêng có khoá, đầy đủ nội thất, mở rộng theo đội ngũ." },
    heroImg: img("/mid/Cabin 2 copy.jpg.webp"),
    enquireLabel: { en: "Enquire now", vi: "Liên hệ ngay" },
    intro: {
      en: "A private office of your own — furnished, serviced, and ready on day one. Choose a single suite, a full floor, or an executive corner, all on flexible terms.",
      vi: "Văn phòng riêng của bạn — đầy đủ nội thất, dịch vụ trọn gói, sẵn sàng ngay ngày đầu. Chọn một suite, trọn tầng hoặc góc điều hành, đều với điều khoản linh hoạt.",
    },
    sections: [
      {
        type: "offering", id: "private-offices", name: "Private Offices",
        img: img("/mid/DSC05831(1).jpg.webp"),
        desc: { en: "Self-contained, lockable offices for 2–50 people with everything included — furniture, fibre, cleaning, and reception.", vi: "Văn phòng khép kín, có khoá cho 2–50 người, bao trọn — nội thất, cáp quang, vệ sinh và lễ tân." },
        how: [
          { t: { en: "Tell us your team size", vi: "Cho biết quy mô đội ngũ" }, d: { en: "Headcount, location, and move-in date.", vi: "Số người, địa điểm và ngày vào ở." } },
          { t: { en: "Tour & choose", vi: "Tham quan & chọn" }, d: { en: "We shortlist suites that fit your budget.", vi: "Chúng tôi chọn suite phù hợp ngân sách." } },
          { t: { en: "Move in", vi: "Vào ở" }, d: { en: "Sign flexibly and start the next day.", vi: "Ký linh hoạt và bắt đầu ngay hôm sau." } },
        ],
        features: { en: ["Furnished & serviced", "Flexible 3–24 month terms", "Branded to your company", "Scale up or down anytime"], vi: ["Nội thất & dịch vụ trọn gói", "Kỳ hạn linh hoạt 3–24 tháng", "Gắn thương hiệu công ty bạn", "Mở rộng/thu gọn bất kỳ lúc nào"] },
        amenityKeys: ["wifi", "reception", "meeting", "printing", "coffee", "access"],
        find: { label: { en: "Find private offices for rent", vi: "Tìm văn phòng riêng cho thuê" }, solution: "Private Workspaces" },
        comparison: true,
      },
      {
        type: "offering", id: "full-floor", name: "Full Floor Office",
        img: img("/mid/DSC06084(1).jpg.webp"),
        desc: { en: "An entire floor configured around how your company works — reception, meeting rooms, breakout, and a private pantry.", vi: "Trọn một tầng được cấu hình theo cách công ty bạn vận hành — lễ tân, phòng họp, khu thư giãn và pantry riêng." },
        how: [
          { t: { en: "Brief", vi: "Trao đổi" }, d: { en: "Share your headcount and workflow.", vi: "Chia sẻ số người và quy trình." } },
          { t: { en: "Design", vi: "Thiết kế" }, d: { en: "We lay out the floor to suit.", vi: "Chúng tôi bố trí mặt sàn phù hợp." } },
          { t: { en: "Operate", vi: "Vận hành" }, d: { en: "We manage it; you just work.", vi: "Chúng tôi quản lý; bạn chỉ việc làm việc." } },
        ],
        features: { en: ["Dedicated reception", "Private meeting suites", "Custom branding", "Single monthly invoice"], vi: ["Lễ tân riêng", "Phòng họp riêng", "Thương hiệu tuỳ chỉnh", "Một hoá đơn hàng tháng"] },
        amenityKeys: ["reception", "meeting", "parking", "climate", "access"],
        find: { label: { en: "Find a full floor", vi: "Tìm trọn tầng" }, solution: "Private Workspaces" },
      },
      {
        type: "offering", id: "executive-suites", name: "Executive Suites",
        img: img("/mid/Lounge 2 copy.jpg.webp"),
        desc: { en: "Premium corner suites with a private lounge, kitchenette, and VIP reception — the most prestigious addresses we offer.", vi: "Suite góc cao cấp với lounge riêng, bếp nhỏ và lễ tân VIP — những địa chỉ danh giá nhất của chúng tôi." },
        how: [
          { t: { en: "Select", vi: "Chọn" }, d: { en: "Pick your floor and view.", vi: "Chọn tầng và tầm nhìn." } },
          { t: { en: "Personalise", vi: "Cá nhân hoá" }, d: { en: "Finishes and layout to taste.", vi: "Hoàn thiện và bố cục theo ý." } },
          { t: { en: "Settle in", vi: "Ổn định" }, d: { en: "Concierge handles the rest.", vi: "Concierge lo phần còn lại." } },
        ],
        features: { en: ["Corner views", "Private lounge & pantry", "VIP reception", "Priority meeting rooms"], vi: ["Tầm nhìn góc", "Lounge & pantry riêng", "Lễ tân VIP", "Ưu tiên phòng họp"] },
        amenityKeys: ["lounge", "reception", "coffee", "meeting", "access"],
        find: { label: { en: "Find executive suites", vi: "Tìm suite điều hành" }, solution: "Private Workspaces" },
      },
    ],
    other: ["hybrid-work", "e-office", "enterprise", "corporate-suites"],
  },

  /* ───────── Hybrid Work / HyFlex (rows 32–38) ───────── */
  "hybrid-work": {
    slug: "hybrid-work",
    title: "Hybrid Work",
    tagline: { en: "One membership, every HiLink floor. Work wherever the day takes you.", vi: "Một thẻ hội viên, mọi tầng HiLink. Làm việc ở bất cứ đâu trong ngày." },
    heroImg: img("/mid/DSC05749.jpg.webp"),
    enquireLabel: { en: "Enquire now", vi: "Liên hệ ngay" },
    intro: {
      en: "HyFlex gives hybrid teams the freedom to roam. Use any HiLink location on a single membership, with desks and offices ready when you need them.",
      vi: "HyFlex cho các đội hybrid tự do di chuyển. Dùng mọi địa điểm HiLink với một thẻ, có bàn và văn phòng sẵn sàng khi cần.",
    },
    sections: [
      {
        type: "offering", id: "roam", name: "HyFlex Roam Memberships",
        img: img("/mid/DSC06008.jpg.webp"),
        desc: { en: "Roam across every HiLink location and use shared workspace on demand. Ideal for travelling and distributed teams.", vi: "Di chuyển khắp mọi địa điểm HiLink và dùng không gian chung theo nhu cầu. Lý tưởng cho đội ngũ công tác và phân tán." },
        how: [
          { t: { en: "Join", vi: "Tham gia" }, d: { en: "Pick a monthly plan.", vi: "Chọn gói hàng tháng." } },
          { t: { en: "Check in", vi: "Nhận chỗ" }, d: { en: "Use the app at any site.", vi: "Dùng app tại mọi cơ sở." } },
          { t: { en: "Work", vi: "Làm việc" }, d: { en: "Any lounge, any desk.", vi: "Bất kỳ lounge, bất kỳ bàn." } },
        ],
        features: { en: ["Access all locations", "Pay monthly, no lock-in", "Bookable meeting credits", "Member app"], vi: ["Vào mọi địa điểm", "Trả theo tháng, không ràng buộc", "Tín dụng đặt phòng họp", "App hội viên"] },
        amenityKeys: ["wifi", "coffee", "lounge", "access"],
        find: { label: { en: "Find desks for rent", vi: "Tìm bàn cho thuê" }, solution: "Hybrid Work" },
      },
      {
        type: "offering", id: "office-memberships", name: "HyFlex Office Memberships",
        img: img("/mid/DSC05955(1).jpg.webp"),
        desc: { en: "A private office when you need it, hybrid economics when you don't — a guaranteed room plus roaming access.", vi: "Văn phòng riêng khi cần, kinh tế hybrid khi không — một phòng đảm bảo cùng quyền roam." },
        how: [
          { t: { en: "Choose a base", vi: "Chọn cơ sở chính" }, d: { en: "Your home office location.", vi: "Văn phòng chính của bạn." } },
          { t: { en: "Add roaming", vi: "Thêm roam" }, d: { en: "Use other sites too.", vi: "Dùng thêm cơ sở khác." } },
          { t: { en: "Flex", vi: "Linh hoạt" }, d: { en: "Adjust seats monthly.", vi: "Điều chỉnh chỗ hàng tháng." } },
        ],
        features: { en: ["Guaranteed private room", "Roam to all sites", "Monthly seat flexibility", "Meeting credits"], vi: ["Phòng riêng đảm bảo", "Roam mọi cơ sở", "Linh hoạt chỗ hàng tháng", "Tín dụng phòng họp"] },
        amenityKeys: ["reception", "meeting", "wifi", "access"],
        find: { label: { en: "Find offices for rent", vi: "Tìm văn phòng cho thuê" }, solution: "Hybrid Work" },
      },
      {
        type: "offering", id: "flex-desk", name: "Flex Desk",
        img: img("/mid/DSC05749.jpg.webp"),
        desc: { en: "An unassigned desk in our shared lounges — grab any open spot, day or month.", vi: "Bàn không cố định trong lounge chung — chọn chỗ trống bất kỳ, theo ngày hoặc tháng." },
        features: { en: ["First-come seating", "Day or monthly", "Lounge amenities", "Community events"], vi: ["Chỗ ngồi tự do", "Theo ngày hoặc tháng", "Tiện ích lounge", "Sự kiện cộng đồng"] },
        amenityKeys: ["wifi", "coffee", "lounge", "printing"],
        find: { label: { en: "Find desks for rent", vi: "Tìm bàn cho thuê" }, solution: "Hybrid Work" },
      },
      {
        type: "offering", id: "resident-desk", name: "Resident Desks",
        img: img("/mid/DSC06104.jpg.webp"),
        desc: { en: "Your own dedicated desk in a shared space — keep your monitor, store your things, same seat every day.", vi: "Bàn cố định của riêng bạn trong không gian chung — giữ màn hình, để đồ, cùng một chỗ mỗi ngày." },
        features: { en: ["Dedicated seat", "Lockable storage", "24/7 access", "Mail handling"], vi: ["Chỗ cố định", "Tủ khoá riêng", "Ra vào 24/7", "Nhận thư từ"] },
        amenityKeys: ["wifi", "lock", "access", "mail"],
        find: { label: { en: "Find desks for rent", vi: "Tìm bàn cho thuê" }, solution: "Hybrid Work" },
      },
    ],
    other: ["private-workspaces", "e-office", "corporate-suites", "enterprise"],
  },

  /* ───────── e-Office (rows 39–43) ───────── */
  "e-office": {
    slug: "e-office",
    title: "e-Office",
    tagline: { en: "A premium Hanoi business address — without the office overhead.", vi: "Địa chỉ doanh nghiệp Hà Nội cao cấp — không tốn chi phí văn phòng." },
    heroImg: img("/mid/9422f5054b4e72a0f5d2a5da96428320cc07f603-1490x2000.avif.webp"),
    enquireLabel: { en: "Enquire now", vi: "Liên hệ ngay" },
    intro: {
      en: "Run your business from a prestigious HiLink address while we handle your mail, calls, and reception — and drop in for a desk or meeting room whenever you need one.",
      vi: "Vận hành doanh nghiệp từ một địa chỉ HiLink danh giá trong khi chúng tôi lo thư từ, cuộc gọi và lễ tân — và ghé dùng bàn hay phòng họp bất cứ khi nào bạn cần.",
    },
    sections: [
      {
        type: "offering", id: "virtual-office", name: "Virtual Office",
        img: img("/mid/DSC06104.jpg.webp"),
        desc: { en: "Everything you need to run a credible business presence in Hanoi — a registered address, professional mail and call handling, and on-demand access to our spaces — without paying for a full-time office.", vi: "Mọi thứ để vận hành hiện diện doanh nghiệp uy tín tại Hà Nội — địa chỉ đăng ký, xử lý thư và cuộc gọi chuyên nghiệp, và quyền dùng không gian theo nhu cầu — mà không phải trả cho một văn phòng toàn thời gian." },
        how: [
          { t: { en: "Choose your address", vi: "Chọn địa chỉ" }, d: { en: "Pick a central HiLink location to register.", vi: "Chọn một địa điểm HiLink trung tâm để đăng ký." } },
          { t: { en: "We handle the rest", vi: "Chúng tôi lo phần còn lại" }, d: { en: "Mail, calls, and reception in your company name.", vi: "Thư, cuộc gọi và lễ tân theo tên công ty bạn." } },
          { t: { en: "Drop in anytime", vi: "Ghé bất cứ lúc nào" }, d: { en: "Use day passes and meeting rooms on demand.", vi: "Dùng vé ngày và phòng họp theo nhu cầu." } },
        ],
        features: { en: ["Registered business address", "Mail scanning & forwarding", "Local phone & call answering", "Meeting-room credits"], vi: ["Địa chỉ kinh doanh đăng ký", "Quét & chuyển tiếp thư", "Số điện thoại & trả lời cuộc gọi", "Tín dụng phòng họp"] },
        amenityKeys: ["mail", "phone", "reception", "wifi", "coffee", "access"],
        find: { label: { en: "Find an e-Office address", vi: "Tìm địa chỉ e-Office" }, solution: "e-Office" },
      },
      {
        type: "benefits", title: { en: "What's included", vi: "Bao gồm những gì" },
        items: [
          { icon: "building", t: { en: "Prestigious address", vi: "Địa chỉ danh giá" }, d: { en: "Register your company at a central Hanoi location.", vi: "Đăng ký công ty tại địa chỉ trung tâm Hà Nội." } },
          { icon: "mail", t: { en: "Mail handling", vi: "Nhận & chuyển thư" }, d: { en: "We receive, scan, and forward your post.", vi: "Chúng tôi nhận, scan và chuyển tiếp thư." } },
          { icon: "phone", t: { en: "Call answering", vi: "Trả lời cuộc gọi" }, d: { en: "A local number answered in your name.", vi: "Số nội địa trả lời theo tên bạn." } },
          { icon: "reception", t: { en: "Meeting access", vi: "Quyền dùng phòng họp" }, d: { en: "Book rooms and day passes as needed.", vi: "Đặt phòng và vé ngày khi cần." } },
          { icon: "users", t: { en: "Admin support", vi: "Hỗ trợ hành chính" }, d: { en: "Reception and concierge handle the details.", vi: "Lễ tân và concierge lo các chi tiết." } },
          { icon: "coffee", t: { en: "Community access", vi: "Cộng đồng" }, d: { en: "Member events and café whenever you visit.", vi: "Sự kiện thành viên và café mỗi khi ghé." } },
        ],
      },
      {
        type: "packages", title: { en: "e-Office plans", vi: "Gói e-Office" },
        plans: [
          { name: "Starter", price: { en: "₫299k / mo", vi: "₫299k / tháng" }, features: { en: ["Business address", "Mail receipt & scan", "2 day passes / mo"], vi: ["Địa chỉ kinh doanh", "Nhận & scan thư", "2 vé ngày / tháng"] } },
          { name: "Standard", price: { en: "₫599k / mo", vi: "₫599k / tháng" }, features: { en: ["Everything in Starter", "Mail forwarding", "Local phone number", "4 day passes / mo"], vi: ["Mọi thứ trong Starter", "Chuyển tiếp thư", "Số điện thoại nội địa", "4 vé ngày / tháng"] } },
          { name: "Premium", price: { en: "₫899k / mo", vi: "₫899k / tháng" }, featured: true, features: { en: ["Everything in Standard", "Call answering in your name", "Meeting-room credits", "Unlimited day passes"], vi: ["Mọi thứ trong Standard", "Trả lời cuộc gọi theo tên bạn", "Tín dụng phòng họp", "Vé ngày không giới hạn"] } },
        ],
      },
      {
        type: "findLocations", title: { en: "Find an e-Office address", vi: "Tìm địa chỉ e-Office" },
        text: { en: "Choose from our central Hanoi locations for your registered business address.", vi: "Chọn trong các địa điểm trung tâm Hà Nội cho địa chỉ kinh doanh của bạn." },
        solution: "e-Office",
      },
      { type: "enquiryForm", title: { en: "Set up your e-Office", vi: "Thiết lập e-Office của bạn" } },
    ],
    other: ["hybrid-work", "private-workspaces", "corporate-suites", "enterprise"],
  },

  /* ───────── Corporate Suites (rows 44–50) ───────── */
  "corporate-suites": {
    slug: "corporate-suites",
    title: "Corporate Suites",
    tagline: { en: "Meeting rooms, boardrooms, and private lounges — booked by the hour.", vi: "Phòng họp, phòng hội nghị và lounge riêng — đặt theo giờ." },
    heroImg: img("/mid/Meeting room 6 copy.jpg.webp"),
    enquireLabel: { en: "Book now", vi: "Đặt ngay" },
    intro: {
      en: "On-demand corporate spaces for meetings, presentations, and client hospitality — fully equipped and staffed, available by the hour or day.",
      vi: "Không gian doanh nghiệp theo nhu cầu cho họp, thuyết trình và tiếp khách — trang bị đầy đủ và có nhân sự, theo giờ hoặc ngày.",
    },
    sections: [
      {
        type: "offering", id: "meeting-room", name: "Meeting Room",
        img: img("/mid/Meeting room 4  (1).jpg.webp"),
        desc: { en: "Bright, acoustically treated rooms for 4–12 with screen, video bridge, and whiteboard.", vi: "Phòng sáng, cách âm cho 4–12 người với màn hình, cầu hội nghị và bảng trắng." },
        features: { en: ["4–12 seats", "4K display & video", "Whiteboard", "Catering on request"], vi: ["4–12 chỗ", "Màn hình 4K & video", "Bảng trắng", "Phục vụ ăn theo yêu cầu"] },
        amenityKeys: ["av", "wifi", "coffee", "reception"],
        find: { label: { en: "Find meeting rooms for rent", vi: "Tìm phòng họp cho thuê" }, solution: "Corporate Suites" },
      },
      {
        type: "offering", id: "conference-room", name: "Conference Room",
        img: img("/mid/Meeting room 6 copy.jpg.webp"),
        desc: { en: "Large-format boardrooms for 12–40 with full A/V production and hybrid conferencing.", vi: "Phòng hội nghị lớn cho 12–40 người với sản xuất A/V đầy đủ và họp hybrid." },
        features: { en: ["12–40 seats", "Hybrid conferencing", "Dual projection", "Event support"], vi: ["12–40 chỗ", "Họp hybrid", "Chiếu kép", "Hỗ trợ sự kiện"] },
        amenityKeys: ["av", "wifi", "reception", "climate"],
        find: { label: { en: "Find conference rooms for rent", vi: "Tìm phòng hội nghị cho thuê" }, solution: "Corporate Suites" },
      },
      {
        type: "offering", id: "private-lounge", name: "Private Lounge",
        img: img("/mid/Lounge 9 copy.jpg.webp"),
        desc: { en: "An elegant lounge for client hospitality, interviews, and informal gatherings.", vi: "Lounge sang trọng để tiếp khách, phỏng vấn và gặp gỡ thân mật." },
        features: { en: ["Relaxed seating", "Barista service", "Private & quiet", "Flexible hours"], vi: ["Chỗ ngồi thư giãn", "Phục vụ barista", "Riêng tư & yên tĩnh", "Giờ linh hoạt"] },
        amenityKeys: ["lounge", "coffee", "wifi", "reception"],
        find: { label: { en: "Find private lounges for rent", vi: "Tìm lounge riêng cho thuê" }, solution: "Corporate Suites" },
      },
    ],
    other: ["specialized-suites", "private-workspaces", "hybrid-work", "enterprise"],
  },

  /* ───────── Specialized Suites (rows 51–56) ───────── */
  "specialized-suites": {
    slug: "specialized-suites",
    title: "Specialized Suites",
    tagline: { en: "Purpose-built rooms for media, training, and creative work.", vi: "Phòng chuyên dụng cho media, đào tạo và sáng tạo." },
    heroImg: img("/mid/DSC06155(1).jpg.webp"),
    enquireLabel: { en: "Book now", vi: "Đặt ngay" },
    intro: {
      en: "When a standard room won't do — soundproofed media studios, configurable training rooms, and creative suites equipped for the work.",
      vi: "Khi phòng thường không đủ — studio media cách âm, phòng đào tạo linh hoạt và suite sáng tạo trang bị chuyên dụng.",
    },
    sections: [
      {
        type: "offering", id: "media-suites", name: "Media Suites",
        img: img("/mid/DSC06198.jpg.webp"),
        desc: { en: "Soundproofed studios for podcasts, video, and livestreams, with lighting and recording gear.", vi: "Studio cách âm cho podcast, video và livestream, có thiết bị ánh sáng và ghi hình." },
        features: { en: ["Acoustic treatment", "Lighting rig", "Recording gear", "Editing desk"], vi: ["Xử lý âm học", "Hệ thống đèn", "Thiết bị ghi", "Bàn dựng"] },
        amenityKeys: ["av", "wifi", "climate", "access"],
      },
      {
        type: "offering", id: "training-suites", name: "Education & Training Suites",
        img: img("/mid/DSC06084(1).jpg.webp"),
        desc: { en: "Configurable rooms for workshops and courses — movable furniture and presentation A/V.", vi: "Phòng linh hoạt cho workshop và khoá học — nội thất di động và A/V trình chiếu." },
        features: { en: ["Movable layout", "Presentation A/V", "Breakout space", "Catering on request"], vi: ["Bố cục di động", "A/V trình chiếu", "Khu breakout", "Phục vụ ăn theo yêu cầu"] },
        amenityKeys: ["av", "wifi", "coffee", "reception"],
      },
      {
        type: "offering", id: "creative-suites", name: "Creative & Design Suites",
        img: img("/mid/Cabin 2 copy.jpg.webp"),
        desc: { en: "Inspiring studios for design teams — natural light, writable walls, and project space.", vi: "Studio truyền cảm hứng cho đội thiết kế — ánh sáng tự nhiên, tường viết được và không gian dự án." },
        features: { en: ["Natural light", "Writable walls", "Pin-up space", "Flexible furniture"], vi: ["Ánh sáng tự nhiên", "Tường viết được", "Khu trưng bày", "Nội thất linh hoạt"] },
        amenityKeys: ["light", "wifi", "lounge", "access"],
      },
    ],
    other: ["corporate-suites", "private-workspaces", "hybrid-work", "enterprise"],
  },

  /* ───────── Enterprise Solutions (rows 57–65) ───────── */
  "enterprise": {
    slug: "enterprise",
    title: "Enterprise Solutions",
    tagline: { en: "Bespoke workspace at scale — designed, built, and managed by HiLink.", vi: "Không gian làm việc tuỳ chỉnh quy mô lớn — HiLink thiết kế, xây dựng và quản lý." },
    heroImg: img("/mid/DSC06084(1).jpg.webp"),
    enquireLabel: { en: "Book now", vi: "Đặt ngay" },
    intro: {
      en: "For teams of 50+, we design and operate workspace around your business — from a build-to-suit fit-out to a fully managed office you brand as your own.",
      vi: "Cho đội ngũ 50+, chúng tôi thiết kế và vận hành không gian quanh doanh nghiệp bạn — từ build-to-suit đến văn phòng quản lý trọn gói mang thương hiệu của bạn.",
    },
    sections: [
      {
        type: "offering", id: "build-to-suit", name: "Build to Suit",
        img: img("/mid/DSC06155(1).jpg.webp"),
        desc: { en: "A workspace designed and fitted out to your exact specification, on our infrastructure.", vi: "Không gian được thiết kế và thi công đúng yêu cầu của bạn, trên hạ tầng của chúng tôi." },
        how: [
          { t: { en: "Discover", vi: "Tìm hiểu" }, d: { en: "We map your requirements.", vi: "Chúng tôi xác định yêu cầu." } },
          { t: { en: "Design & build", vi: "Thiết kế & xây dựng" }, d: { en: "Fit-out to your spec.", vi: "Thi công đúng yêu cầu." } },
          { t: { en: "Manage", vi: "Quản lý" }, d: { en: "We run it day to day.", vi: "Chúng tôi vận hành hằng ngày." } },
        ],
        features: { en: ["Custom design", "Your branding", "Single contract", "Managed services"], vi: ["Thiết kế riêng", "Thương hiệu của bạn", "Một hợp đồng", "Dịch vụ quản lý"] },
        amenityKeys: ["reception", "meeting", "parking", "climate", "access"],
      },
      {
        type: "offering", id: "turnkey", name: "Turnkey Offices",
        img: img("/mid/DSC05831(1).jpg.webp"),
        desc: { en: "A ready-to-occupy office, fully furnished and serviced — move a large team in within weeks.", vi: "Văn phòng sẵn sàng vào ở, đầy đủ nội thất và dịch vụ — chuyển cả đội lớn trong vài tuần." },
        features: { en: ["Rapid move-in", "Fully serviced", "Scalable", "Predictable cost"], vi: ["Vào ở nhanh", "Dịch vụ trọn gói", "Mở rộng được", "Chi phí dự đoán được"] },
        amenityKeys: ["reception", "meeting", "wifi", "access"],
      },
      {
        type: "offering", id: "dmo", name: "Dedicated Managed Offices (DMO)",
        img: img("/mid/Lounge 2 copy.jpg.webp"),
        desc: { en: "A private, branded office managed by HiLink — your space, our operations team.", vi: "Văn phòng riêng mang thương hiệu của bạn do HiLink quản lý — không gian của bạn, đội vận hành của chúng tôi." },
        features: { en: ["Private & branded", "Dedicated support", "Flexible term", "One invoice"], vi: ["Riêng tư & gắn thương hiệu", "Hỗ trợ chuyên trách", "Kỳ hạn linh hoạt", "Một hoá đơn"] },
        amenityKeys: ["reception", "lounge", "meeting", "climate", "access"],
      },
      {
        type: "caseStudy", title: { en: "Case study", vi: "Câu chuyện điển hình" },
        img: img("/mid/DSC06104.jpg.webp"),
        quote: { en: "HiLink built and now runs our 60-desk Hanoi headquarters. We moved in within six weeks and have never thought about facilities since.", vi: "HiLink đã xây và đang vận hành trụ sở 60 chỗ tại Hà Nội của chúng tôi. Chúng tôi vào ở trong sáu tuần và chưa từng phải lo về cơ sở vật chất." },
        author: { en: "Regional Director · NovaTech", vi: "Giám đốc Khu vực · NovaTech" },
      },
      {
        type: "customers", title: { en: "Our customers", vi: "Khách hàng của chúng tôi" },
        logos: ["NovaTech", "Seoul Tech", "Indochina Capital", "BlueOcean", "Studio LFA", "Acme"],
      },
      { type: "enquiryForm", title: { en: "Talk to our enterprise team", vi: "Trao đổi với đội doanh nghiệp" } },
    ],
    other: ["private-workspaces", "hybrid-work", "corporate-suites", "specialized-suites"],
  },
};

export const getSolution = (slug) => SOLUTIONS[slug] || null;
