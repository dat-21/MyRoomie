# 🏠 MyRoomie — Nền tảng tìm bạn cùng phòng thông minh

> **MyRoomie** là ứng dụng web giúp sinh viên và người đi làm tại Đà Nẵng tìm kiếm bạn cùng phòng phù hợp dựa trên lối sống, sở thích và ngân sách. Ứng dụng sử dụng thuật toán matching thông minh để đề xuất những người bạn cùng phòng tương thích nhất.

---

## 📋 Mục lục

- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Tổng quan tính năng](#-tổng-quan-tính-năng)
- [Chi tiết từng trang](#-chi-tiết-từng-trang)
  - [Trang chủ (Landing Page)](#1-trang-chủ-landing-page---)
  - [Tìm bạn cùng phòng (Find Roommate)](#2-tìm-bạn-cùng-phòng-find-roommate---find)
  - [Đăng phòng (Post Room)](#3-đăng-phòng-post-room---post)
  - [Trang cá nhân (Profile)](#4-trang-cá-nhân-profile---profile)
  - [Xem tất cả phòng (View All Rooms)](#5-xem-tất-cả-phòng-view-all-rooms---rooms)
  - [Xem tất cả matches (View All Matches)](#6-xem-tất-cả-matches-view-all-matches---matches)
  - [Trang Premium](#7-trang-premium--premium)
- [Chi tiết Components](#-chi-tiết-components)
  - [Navbar](#navbar)
  - [Footer](#footer)
  - [RoommateCard](#roommatecard)
  - [MatchCircle](#matchcircle)
  - [Modal](#modal)
  - [RoomDetailContent](#roomdetailcontent)
  - [ChatPanel](#chatpanel)
- [Custom Hooks](#-custom-hooks)
- [Hệ thống dữ liệu Mock](#-hệ-thống-dữ-liệu-mock)
- [Hệ thống thiết kế (Design System)](#-hệ-thống-thiết-kế-design-system)
- [Luồng hoạt động chính](#-luồng-hoạt-động-chính)

---

## 🛠 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **React** | 19.2.4 | UI Framework |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Vite** | 7.3.1 | Build tool & Dev server |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **Framer Motion** | 12.34.2 | Animation library |
| **React Router DOM** | 7.13.0 | Client-side routing |
| **Lucide React** | 0.574.0 | Icon library |
| **@fontsource/poppins** | — | Font cho headings |
| **@fontsource/inter** | — | Font cho body text |

---

## 🚀 Cài đặt & Chạy dự án

```bash
# 1. Clone repository
git clone <repo-url>
cd MyRoomie

# 2. Cài đặt dependencies
npm install

# 3. Chạy development server
npm run dev

# 4. Build production
npm run build

# 5. Preview production build
npm run preview
```

Ứng dụng sẽ chạy tại `http://localhost:5173` (mặc định).

---

## 📁 Cấu trúc thư mục

```
MyRoomie/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Navigation bar (sticky, responsive)
│   │   ├── Footer.tsx          # Footer 4 cột
│   │   ├── RoommateCard.tsx    # Card hiển thị thông tin roommate
│   │   ├── MatchCircle.tsx     # Vòng tròn % tương thích (animated)
│   │   ├── Modal.tsx           # Modal overlay (reusable)
│   │   ├── RoomDetailContent.tsx # Nội dung chi tiết phòng
│   │   └── ChatPanel.tsx       # Panel chat slide-in
│   ├── data/
│   │   └── mockData.ts         # Dữ liệu giả, interfaces, utilities
│   ├── hooks/
│   │   ├── useInView.ts        # Hook phát hiện element trong viewport
│   │   └── useCountUp.ts       # Hook đếm số animated
│   ├── pages/
│   │   ├── LandingPage.tsx     # Trang chủ
│   │   ├── FindRoommatePage.tsx # Tìm bạn cùng phòng
│   │   ├── PostRoomPage.tsx    # Đăng phòng (multi-step wizard)
│   │   ├── ProfilePage.tsx     # Trang cá nhân (xem/sửa)
│   │   ├── ViewAllRoomsPage.tsx    # Danh sách tất cả phòng
│   │   ├── ViewAllMatchesPage.tsx  # Danh sách tất cả matches
│   │   └── PremiumPage.tsx     # Trang Premium subscription
│   ├── styles/
│   │   └── index.css           # Global styles & design tokens
│   ├── App.tsx                 # Root component + routing
│   └── main.tsx                # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🌟 Tổng quan tính năng

| # | Tính năng | Mô tả | Trang/Component |
|---|---|---|---|
| 1 | **Matching thông minh** | Tính toán % tương thích dựa trên lối sống, sở thích, ngân sách | RoommateCard, MatchCircle, ProfilePage |
| 2 | **Tìm kiếm & Lọc nâng cao** | Lọc theo giới tính, ngân sách, ngày chuyển vào, lifestyle tags | FindRoommatePage, ViewAllRoomsPage, ViewAllMatchesPage |
| 3 | **Duyệt phòng trọ** | Xem danh sách phòng với hình ảnh, tiện ích, giá cả | ViewAllRoomsPage, LandingPage |
| 4 | **Chi tiết phòng (Modal)** | Carousel ảnh, thông tin roommates hiện tại, reviews, booking | RoomDetailContent + Modal |
| 5 | **Đăng phòng trọ** | Wizard 4 bước: thông tin → sở thích → mô tả → xác nhận | PostRoomPage |
| 6 | **Hồ sơ cá nhân** | Xem/chỉnh sửa hồ sơ, xem hồ sơ người khác | ProfilePage |
| 7 | **Kết nối & Nhắn tin** | Connect → Message → Chat Panel slide-in | ChatPanel, ProfilePage, ViewAllMatchesPage |
| 8 | **Chat thời gian thực** | Giao diện chat 2 cột (danh sách + tin nhắn) | ChatPanel |
| 9 | **Premium theo Role** | Sinh viên: 4 gói tìm bạn (có/không AI). Chủ trọ: đẩy tin + mở khóa liên hệ | PremiumPage |
| 10 | **Animations mượt mà** | Page transitions, scroll-triggered, hover effects, counting | Framer Motion + Custom hooks |
| 11 | **Responsive design** | Tương thích mọi kích thước màn hình | Tất cả components |
| 12 | **Glassmorphism UI** | Hiệu ứng kính mờ, gradient, blur | Design System (CSS) |

---

## 📄 Chi tiết từng trang

### 1. Trang chủ (Landing Page) — `/`

**File:** `src/pages/LandingPage.tsx`

#### Layout 2 cột — Hero Section

| Cột trái | Cột phải |
|---|---|
| Badge "✨ Smart Roommate Matching" | Card **Nearby Rooms** (glass effect) |
| Heading gradient "Find Your Perfect Roommate" | Card **Best Matches** (glass effect) |
| Mô tả ngắn | |
| 2 nút CTA: "Find a Roommate" + "Post a Room Slot" | |
| Dãy thống kê: 2.5K+ users / 89% match / 1.2K+ matches | |

#### Card "Nearby Rooms" (cột phải, trên)

- Hiển thị **3 phòng gần nhất** từ mock data
- Mỗi item gồm: thumbnail, tên phòng, quận, giá thuê (VND), khoảng cách (km), điểm match
- **Click vào phòng** → mở Modal chi tiết phòng
- Nút "View All →" → điều hướng đến `/rooms`

#### Card "Best Matches" (cột phải, dưới)

- Hiển thị **3 roommate tương thích nhất** (sort theo compatibility)
- Mỗi item gồm: avatar, tên, nghề nghiệp, lifestyle tags, vòng tròn match %
- Nút "View" → điều hướng đến `/profile/:id`
- Nút "See All Matches →" → điều hướng đến `/matches`

#### Section "How It Works" — 3 bước

1. 📝 **Create Profile** — Thiết lập hồ sơ với sở thích, ngân sách, lối sống
2. 🔍 **Get Matched** — Thuật toán tìm roommate phù hợp nhất
3. 🤝 **Connect & Move In** — Nhắn tin, gặp mặt, và chuyển vào

#### Section "Features" — 6 tính năng

| Icon | Tính năng | Mô tả |
|---|---|---|
| 💚 | Lifestyle Matching | So khớp lối sống thông minh |
| 🛡️ | Verified Profiles | Tài khoản xác minh, an toàn |
| 🧠 | Smart Suggestions | Gợi ý dựa trên hành vi |
| 👥 | Community Driven | Cộng đồng đánh giá |
| 🏠 | Room Slot Posting | Đăng phòng trống dễ dàng |
| 🔒 | Safe Communication | Nhắn tin bảo mật trong app |

#### Section CTA cuối trang

- Banner gradient animated với nút "Get Started Now"

#### Animations

- **FadeSection**: Mỗi section fade-in khi scroll vào viewport (IntersectionObserver)
- **Gradient blobs**: Background animated blobs (pulse, float)
- **Staggered cards**: Cards xuất hiện lần lượt với delay

---

### 2. Tìm bạn cùng phòng (Find Roommate) — `/find`

**File:** `src/pages/FindRoommatePage.tsx`

#### Thanh tìm kiếm

- Input search theo **tên, bio, location**
- Icon kính lúp
- Tìm kiếm real-time (filter client-side)

#### Sắp xếp (Sort)

| Option | Mô tả |
|---|---|
| Compatibility | Theo % tương thích (cao → thấp) |
| Budget: Low to High | Theo ngân sách tối thiểu |
| Budget: High to Low | Theo ngân sách tối đa |
| Move-in Date | Theo ngày chuyển vào (sớm → muộn) |

#### Bộ lọc (Filter Sidebar)

- **Desktop**: Sidebar sticky bên trái
- **Mobile**: Drawer slide-in từ trái, toggle bằng nút "Filters"

| Bộ lọc | Loại | Chi tiết |
|---|---|---|
| Giới tính | Radio buttons | All / Male / Female |
| Ngân sách | Dual range slider | 0 — 15,000,000 VND |
| Ngày chuyển vào | Date picker | Input type="date" |
| Lifestyle Tags | Toggle buttons | 22 tags (ban đầu hiện 8, có nút "Show all") |

#### Filter Chips

- Khi bật filter → hiện chip tag phía trên grid
- Mỗi chip có nút **×** để xóa riêng lẻ
- Nút **"Reset All"** xóa tất cả filters

#### Kết quả

- **Grid 2 cột** sử dụng `<RoommateCard>`
- Hiển thị số lượng kết quả: "Showing X roommates"
- **Loading state**: Skeleton cards (shimmer animation, 1.2s)
- **Empty state**: Thông báo "No roommates found" + gợi ý điều chỉnh bộ lọc

---

### 3. Đăng phòng (Post Room) — `/post`

**File:** `src/pages/PostRoomPage.tsx`

#### Wizard 4 bước với Progress Bar

**Bước 1 — Room Details (Thông tin phòng)**

| Trường | Loại | Validation |
|---|---|---|
| Tiêu đề phòng | Text input | Bắt buộc |
| Vị trí | Text input | Bắt buộc |
| Giá thuê/tháng | Number input | VND |
| Loại phòng | 4 nút chọn | Studio / Private Room / Shared Room / Master Bedroom |
| Số slot trống | Number (1-4) | Dropdown |
| Ngày có thể chuyển vào | Date picker | Input type="date" |

**Bước 2 — Preferences (Sở thích mong muốn)**

- Multi-select từ 22 lifestyle tags
- Chọn những đặc điểm mong muốn ở roommate

**Bước 3 — Description (Mô tả)**

- Textarea với đếm ký tự (tối đa 500)
- Mô tả chi tiết về phòng và môi trường sống

**Bước 4 — Review (Xác nhận)**

- Tổng hợp tất cả thông tin đã nhập
- Hiển thị dạng card với các section rõ ràng
- Nút "Publish Post" để đăng

#### Animations

- **Progress bar**: Dots connected-line, fill gradient khi hoàn thành, check icon
- **Step transitions**: Slide trái/phải animated (direction-aware)
- **Success state**: Card xác nhận với nút "Post Another"

#### Navigation

- Nút **Previous / Next** (step 1 chỉ có Next)
- Step cuối: nút **"Publish Post"** thay thế Next

---

### 4. Trang cá nhân (Profile) — `/profile` & `/profile/:id`

**File:** `src/pages/ProfilePage.tsx`

#### Chế độ xem hồ sơ người khác (`/profile/:id`)

**Header Section**

- Avatar lớn với badge verified (✓)
- Tên, tuổi, giới tính, nghề nghiệp
- Vị trí (location) với icon

**Thông tin chi tiết**

- Bio / mô tả bản thân
- Ngân sách: min — max VND
- Ngày chuyển vào dự kiến

**Vòng tròn tương thích lớn**

- SVG animated circle (size: 128px)
- Animated count-up từ 0 → X% khi scroll vào
- Màu sắc: xanh lá (≥85%) / xanh dương (≥70%) / đỏ (<70%)

**Lifestyle Tags**

- Hiển thị tất cả tags của roommate
- Dạng badge/pill

**Living Preferences (7 danh mục)**

| Preference | Icon | Ví dụ |
|---|---|---|
| Sleep Schedule | 🌙 | Early Bird / Night Owl / Flexible |
| Cleanliness | ✨ | Very Clean / Clean / Moderate |
| Noise Level | 🔊 | Quiet / Moderate / Lively |
| Guests | 👥 | Rarely / Sometimes / Often |
| Smoking | 🚭 | Non-smoker / Outside only |
| Pets | 🐾 | No Pets / Has Pets / Loves Pets |
| Cooking | 🍳 | Often / Sometimes / Rarely |

**Nút hành động — Connect/Message Flow**

1. Ban đầu: Nút **"Connect"** (UserPlus icon)
2. Click Connect → Đổi thành badge **"Connected ✓"** + nút **"Message"** (MessageCircle icon)
3. Click Message → Mở **ChatPanel** slide-in

#### Chế độ xem hồ sơ bản thân (`/profile`)

**Xem (View mode)**

- Hiển thị toàn bộ thông tin cá nhân
- Nút **Edit** (bút chì) góc phải
- Section "Matching Score Preview": Top 4 roommate phù hợp nhất với % tương thích

**Chỉnh sửa (Edit mode)**

- **Bio**: Textarea có thể sửa
- **Lifestyle Tags**: Full list 22 tags, click để toggle bật/tắt
- Nút **"Save Changes"** và **"Cancel"**

**Profile Not Found**

- Nếu truy cập `/profile/:id` với id không tồn tại → hiện thông báo lỗi

---

### 5. Xem tất cả phòng (View All Rooms) — `/rooms`

**File:** `src/pages/ViewAllRoomsPage.tsx`

#### Room Card

| Thành phần | Mô tả |
|---|---|
| Thumbnail | Ảnh phòng với hover zoom effect |
| Badge Verified | Dấu tick xanh (nếu verified) |
| Badge Room Type | Nhãn loại phòng (góc trên trái) |
| Match Score | Vòng tròn % (góc trên phải) |
| Thông tin | Tên, vị trí, khoảng cách |
| Stats | Số phòng ngủ • Phòng tắm • Diện tích (m²) |
| Giá | VND/tháng |
| Rating | ⭐ X.X (N reviews) |

#### Bộ lọc (Filter Sidebar)

| Bộ lọc | Loại | Chi tiết |
|---|---|---|
| Ngân sách | Min/Max inputs | VND format |
| Khoảng cách | Slider | 0.5 — 20 km |
| Loại phòng | Toggle buttons | Studio / Private / Shared / Master |
| Ngày chuyển vào | Date picker | Input type="date" |
| Tiện ích | Toggle buttons | 11 options (WiFi, AC, Kitchen, Washing Machine, Parking, Gym, Pool, Balcony, Elevator, Security, Pets Allowed) |

#### Sắp xếp

| Option | Logic |
|---|---|
| Best Match | matchScore cao → thấp |
| Nearest | distance thấp → cao |
| Lowest Price | rent thấp → cao |
| Highest Price | rent cao → thấp |
| Top Rated | rating cao → thấp |

#### Tương tác

- **Click vào card** → Mở Modal chi tiết phòng (`<Modal>` + `<RoomDetailContent>`)
- **Search** → Tìm theo tên phòng hoặc vị trí
- **Mobile**: Filter sidebar collapsible (slide animation)
- **Empty state**: Khi không có kết quả phù hợp

---

### 6. Xem tất cả matches (View All Matches) — `/matches`

**File:** `src/pages/ViewAllMatchesPage.tsx`

#### Bộ lọc

| Bộ lọc | Options |
|---|---|
| Giới tính | All / Male / Female / Non-binary |
| Giờ ngủ | Early Bird / Moderate / Night Owl |
| Mức độ sạch sẽ | Very Clean / Clean / Moderate |
| Hút thuốc | Non-smoker / Outside Only / Smoker |
| Lifestyle tags | 12 tags đầu tiên (toggle) |

#### Sắp xếp

| Option | Logic |
|---|---|
| Best Match | compatibility cao → thấp |
| Budget: Low to High | budgetMin thấp → cao |
| Budget: High to Low | budgetMax cao → thấp |
| Move-in Date | Sớm → muộn |

#### Connect/Message Flow (trên mỗi card)

```
[Connect] → Click → [Connected ✓] + [Message] → Click Message → ChatPanel mở
```

- Mỗi card có overlay buttons phía dưới
- State `connected` được track riêng cho từng roommate ID
- Click "Message" truyền `initialConversationId` vào ChatPanel

#### Layout

- **Grid 3 cột** (responsive: 1 cột mobile, 2 cột tablet, 3 cột desktop)
- Sử dụng `<RoommateCard>` component
- Search bar + result count

---

### 7. Trang Premium — `/premium`

**File:** `src/pages/PremiumPage.tsx`

Trang Premium được **chia theo 2 role**: **Sinh viên** và **Chủ trọ**. Người dùng chọn tab role ở giữa trang, nội dung (bảng giá, so sánh, FAQ, testimonials) thay đổi tương ứng với animation chuyển đổi.

#### Role Tabs

- **Tab Sinh viên** (🎓): Tìm bạn cùng phòng
- **Tab Chủ trọ** (🏢): Quản lý phòng trọ
- Animation: `layoutId` Spring cho background tab di chuyển mượt
- Chuyển nội dung: `AnimatePresence` fade + slide

#### Section 1 — Hero (thay đổi theo role)

| | Sinh viên | Chủ trọ |
|---|---|---|
| **Heading** | "Tìm bạn cùng phòng **hoàn hảo**" | "Tiếp cận sinh viên **nhanh hơn**" |
| **Mô tả** | Nhắn tin, AI gợi ý, kết nối 3x nhanh hơn | Đẩy tin trang nhất, mở khóa liên hệ SV |
| **Stats** | AI gợi ý / Nhắn tin không giới hạn / Hồ sơ xác minh | Đẩy tin trang nhất / Mở khóa liên hệ / Tăng tiếp cận |

---

#### 🎓 TAB SINH VIÊN

##### Bảng so sánh Miễn phí vs Trả phí

| Tính năng | Miễn phí | Trả phí |
|---|---|---|
| Tìm bạn cùng phòng | Chỉ xem hồ sơ | Đầy đủ |
| Nhắn tin | ✗ | ✓ |
| Gợi ý AI thông minh | ✗ | Gói có AI |
| Xem chi tiết lối sống | Cơ bản | Đầy đủ |
| Ai đã xem hồ sơ bạn | ✗ | ✓ |
| Đẩy hồ sơ lên top | ✗ | ✓ |
| Bộ lọc nâng cao | ✗ | ✓ |
| Badge xác minh | ✗ | ✓ |

##### Bảng giá Sinh viên — 4 gói

| Gói | Thời hạn | Số người nhắn tin | AI gợi ý | Giá |
|---|---|---|---|---|
| **1 Tuần** | 7 ngày | 15 người | ❌ Không | **49,000đ** |
| **1 Tuần + AI** | 7 ngày | 15 người | ✅ Có | **69,000đ** |
| **1 Tháng** | 30 ngày | 60 người | ❌ Không | **149,000đ** 🔥 Phổ biến nhất |
| **1 Tháng + AI** | 30 ngày | 60 người | ✅ Có | **169,000đ** 💎 Đáng giá nhất |

- Mỗi card liệt kê: số người nhắn tin, xem hồ sơ đầy đủ, bộ lọc nâng cao, AI (nếu có), xem ai đã xem
- Gói "1 Tháng" được **scale 105%** với badge gradient
- Gói có AI hiện icon **Bot** màu tím, gói không AI hiện gạch ngang

---

#### 🏢 TAB CHỦ TRỌ

##### A. Đẩy tin & Giữ trang nhất

| Gói | Giá | Thời hạn | Badge |
|---|---|---|---|
| **Đẩy 1 tin** | **19,000đ**/tin | 24 giờ hiển thị trang nhất | — |
| **Gói 10 tin** | **149,000đ**/gói | 10 tin × 24h mỗi tin (~14,900đ/tin) | 🏷 Tiết kiệm 21% |

Tính năng đi kèm:

- Tin nổi bật trang nhất 24h
- Badge "Đang đẩy" nổi bật
- Tăng lượt xem gấp 5x
- Gói 10 tin dùng dần, không hết hạn

##### B. Mở khóa liên hệ Sinh viên

| Gói | Giá | Số liên hệ mở khóa | Badge |
|---|---|---|---|
| **Miễn phí** | **0đ** | 3 liên hệ | — |
| **30 Liên hệ** | **99,000đ** (~3,300đ/liên hệ) | 30 liên hệ | 🔥 Phổ biến nhất |
| **100 Liên hệ** | **249,000đ** (~2,490đ/liên hệ) | 100 liên hệ | 💎 Tiết kiệm nhất |

Tính năng đi kèm:

- Xem SĐT, email đầy đủ sinh viên
- Liên hệ đã mở khóa không hết hạn (vĩnh viễn)
- Ưu tiên hiển thị phòng (gói trả phí)

---

#### Testimonials (thay đổi theo role)

- **Sinh viên**: 3 reviews từ sinh viên dùng gói tìm bạn
- **Chủ trọ**: 3 reviews từ chủ trọ dùng đẩy tin & mở khóa liên hệ
- Avatar (DiceBear), star rating, nội dung tiếng Việt

#### FAQ Accordion (thay đổi theo role)

**Sinh viên:**

| Câu hỏi |
|---|
| Tôi có thể hủy gói bất cứ lúc nào không? |
| Khác biệt giữa gói có AI và không AI? |
| 15 người / 60 người nghĩa là gì? |
| Phương thức thanh toán nào được chấp nhận? |

**Chủ trọ:**

| Câu hỏi |
|---|
| Đẩy tin 24 giờ hoạt động như thế nào? |
| Gói 10 tin có thể dùng dần không? |
| Mở khóa liên hệ sinh viên là gì? |
| Liên hệ đã mở có hết hạn không? |

#### Bottom CTA (thay đổi theo role)

- Sinh viên: "Sẵn sàng tìm bạn cùng phòng?" + "Mua gói ngay"
- Chủ trọ: "Sẵn sàng lấp phòng trống?" + "Nâng cấp ngay"

---

## 🧩 Chi tiết Components

### Navbar

**File:** `src/components/Navbar.tsx`

| Tính năng | Chi tiết |
|---|---|
| **Kiểu** | Sticky top, glassmorphism (blur 24px) |
| **Logo** | Gradient "MR" icon + "My Roomie" text |
| **Menu links** | Home, Find Roommate, Rooms, Matches, Post Room, Premium |
| **Active indicator** | Framer Motion `layoutId` — animated underline di chuyển mượt giữa các link |
| **Chat button** | Icon MessageCircle + badge đỏ hiển thị số tin nhắn chưa đọc (2) |
| **Mobile** | Hamburger menu → dropdown với icon-labeled links |
| **Props** | `onChatOpen: () => void` — callback mở global ChatPanel |

#### Cách hoạt động

1. Component nhận `onChatOpen` prop từ `App.tsx`
2. Khi user click icon tin nhắn → gọi `onChatOpen()` → App set `chatOpen = true` → ChatPanel slide-in
3. Active route được detect bằng `useLocation()` từ React Router
4. Layout animation: khi route thay đổi, underline di chuyển smooth đến link mới

---

### Footer

**File:** `src/components/Footer.tsx`

| Cột | Nội dung |
|---|---|
| Brand | Logo + tagline "Find your perfect roommate match" |
| Quick Links | Home, Find Roommate, Post Room Slot, My Profile |
| Support | FAQ, Safety Tips, Community Guidelines, Contact Us |
| Contact | Email: <hello@myroomie.vn> / Vị trí: Da Nang, Vietnam |

- Copyright footer + "Made with ❤ in Da Nang"
- Quick Links sử dụng React Router `<Link>` (SPA navigation)

---

### RoommateCard

**File:** `src/components/RoommateCard.tsx`

#### Thông tin hiển thị

- Avatar (DiceBear API) + badge verified
- Tên, tuổi, nghề nghiệp
- Vị trí (quận, thành phố)
- Bio (tối đa 2 dòng, text-clamp)
- Lifestyle tags (tối đa 4, còn lại hiện "+N")
- Ngân sách: min — max VND
- Ngày chuyển vào
- Nút "View Details" → `/profile/:id`

#### Vòng tròn tương thích (Compatibility Ring)

- SVG donut chart animated
- Sử dụng `useCountUp` hook — đếm từ 0 → X%
- Sử dụng `useInView` hook — chỉ animate khi scroll vào viewport
- **Màu sắc**:
  - 🟢 Xanh lá (≥ 85%): "Excellent match"
  - 🔵 Xanh dương (≥ 70%): "Good match"  
  - 🔴 Đỏ (< 70%): "Fair match"

#### Animations

- **Scroll-triggered entrance**: Fade-in + slide-up khi scroll vào viewport
- **Stagger delay**: Cards xuất hiện lần lượt (delay = index × 0.1s)
- **Hover lift**: translateY(-6px) + shadow tăng
- **Glassmorphic card**: Background white/60%, blur 16px

---

### MatchCircle

**File:** `src/components/MatchCircle.tsx`

Component tái sử dụng hiển thị % tương thích dạng vòng tròn.

| Size | Kích thước | Dùng ở |
|---|---|---|
| `sm` | 56 × 56 px | Nearby Room items, Room Cards |
| `md` | 64 × 64 px | Match Profile items |
| `lg` | 128 × 128 px | Profile Page |

#### Cách hoạt động

1. Nhận prop `percentage` (0-100) và `size`
2. Tính `strokeDashoffset` dựa trên circumference và percentage
3. SVG circle animate từ full offset → target offset
4. Số % animated count-up bằng `useCountUp`
5. Màu sắc tự động theo ngưỡng (85/70)

---

### Modal

**File:** `src/components/Modal.tsx`

Component modal overlay tái sử dụng.

| Prop | Type | Mô tả |
|---|---|---|
| `isOpen` | boolean | Hiển thị/ẩn modal |
| `onClose` | function | Callback khi đóng |
| `size` | 'md' \| 'lg' \| 'xl' \| 'full' | Kích thước modal |
| `children` | ReactNode | Nội dung bên trong |

#### Cách hoạt động

1. Khi `isOpen = true`: render backdrop (blur + dark overlay) + content
2. **Spring animation**: Content scale từ 0.95 → 1 + translateY từ 20px → 0
3. **Click backdrop** → gọi `onClose()`
4. **Nút X** góc phải trên → gọi `onClose()`
5. **Body scroll lock**: Khi mở, disable scroll trên `<body>` → đóng thì restore
6. `AnimatePresence` cho smooth exit animation

---

### RoomDetailContent

**File:** `src/components/RoomDetailContent.tsx`

Nội dung chi tiết một phòng, render bên trong `<Modal>`.

#### Image Carousel

- Mảng ảnh (từ `room.images[]`)
- Nút **Previous / Next** (mũi tên trái/phải)
- **Dot indicators** phía dưới (click để nhảy đến ảnh)
- Badge verified + room type overlay trên ảnh

#### Layout 2 cột

**Cột trái (2/3)**

| Section | Chi tiết |
|---|---|
| Header | Tiêu đề, rating ⭐, số reviews, vị trí |
| Quick Stats | 🛏 Bedrooms • 🚿 Bathrooms • 📐 Area (m²) |
| Current Roommates | Avatar, tên, tags, quote/comment |
| Description | Text mô tả (preserve whitespace) |
| Amenities | Grid icons (WiFi, AC, Parking...), nút "Show all N amenities" |
| Reviews | Avatar, tên, ngày, nội dung, nút "Show all reviews" |

**Cột phải (1/3) — Booking Card (sticky)**

| Thành phần | Chi tiết |
|---|---|
| Giá | X,XXX,XXX đ/month |
| Availability | Badge "Available" (xanh) |
| Move-in Date | Ngày có thể chuyển vào |
| Duration | Thời hạn thuê |
| Room Type | Loại phòng |
| CTA | Nút "Book a Viewing" |
| Contact | Textarea + "Send Message" |
| Actions | Share + Save buttons |
| Owner Info | Avatar, tên, response time, nút gọi |

---

### ChatPanel

**File:** `src/components/ChatPanel.tsx`

Panel chat slide-in từ phải, overlay toàn màn hình.

#### Layout 2 cột

**Cột trái — Danh sách cuộc trò chuyện**

| Thành phần | Chi tiết |
|---|---|
| Search | Input tìm kiếm conversations |
| Label | "Active Chats" |
| Conversation Item | Avatar + online dot (🟢) + tên + last message preview + timestamp + unread badge |
| Current User | Thông tin user đang đăng nhập (footer) |

**Cột phải — Khu vực chat**

| Thành phần | Chi tiết |
|---|---|
| Header | Tên + online status + icon buttons (Search, Phone, Profile) |
| Safety Tip | Banner vàng "Meet in public places..." |
| Match Badge | "You matched with [Name]!" |
| Messages | Bubbles: sent (gradient xanh, phải) / received (xám, trái) + avatar + timestamp |
| Input | Textarea + Emoji button + Send button |

#### Cách hoạt động chi tiết

```
1. User click icon chat (Navbar) hoặc nút "Message" (Profile/Matches)
   ↓
2. App.tsx set chatOpen = true (+ optional conversationId)
   ↓
3. ChatPanel render với spring animation (slide từ phải)
   ↓
4. Body scroll bị lock (overflow: hidden)
   ↓
5. Nếu có initialConversationId → tự động select conversation đó
   ↓
6. User chọn conversation từ sidebar
   ↓
7. Hiển thị messages, auto-scroll xuống tin mới nhất
   ↓
8. User gõ tin nhắn → Enter để gửi (Shift+Enter xuống dòng)
   ↓
9. Message mới thêm vào state, tự scroll xuống
   ↓
10. Click backdrop hoặc nút X → đóng panel, restore scroll
```

#### Props

| Prop | Type | Mô tả |
|---|---|---|
| `isOpen` | boolean | Hiển thị/ẩn panel |
| `onClose` | function | Callback đóng panel |
| `initialConversationId` | string? | ID conversation mở sẵn |

---

## 🪝 Custom Hooks

### useInView

**File:** `src/hooks/useInView.ts`

```typescript
const [ref, isInView] = useInView(threshold?: number)
```

| Param | Default | Mô tả |
|---|---|---|
| `threshold` | 0.1 | % element phải visible để trigger |

#### Cách hoạt động

1. Tạo `IntersectionObserver` với threshold
2. Observe element qua `ref`
3. Khi element vào viewport → set `isInView = true`
4. **Unobserve** ngay sau đó (chỉ trigger 1 lần — one-shot)
5. Dùng cho: scroll-triggered animations, lazy loading

---

### useCountUp

**File:** `src/hooks/useCountUp.ts`

```typescript
const count = useCountUp(target: number, duration?: number, start?: boolean)
```

| Param | Default | Mô tả |
|---|---|---|
| `target` | — | Số đích cần đếm tới |
| `duration` | 1500 | Thời gian animation (ms) |
| `start` | true | Có bắt đầu đếm không |

#### Cách hoạt động

1. Sử dụng `requestAnimationFrame` cho smooth 60fps
2. Linear interpolation: `value = target × (elapsed / duration)`
3. Khi `elapsed >= duration` → set value = target (exact)
4. Cleanup: cancel animation frame khi unmount
5. Kết hợp với `useInView`: `start = isInView` → đếm khi scroll vào

---

## 📊 Hệ thống dữ liệu Mock

**File:** `src/data/mockData.ts`

### Interfaces

```typescript
// Thông tin roommate
interface Roommate {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'non-binary'
  avatar: string           // DiceBear API URL
  compatibility: number    // 0-100%
  budget: { min: number; max: number }
  moveInDate: string
  location: string
  occupation: string
  bio: string
  lifestyleTags: string[]
  preferences: {
    sleepSchedule: string
    cleanliness: string
    noiseLevel: string
    guests: string
    smoking: string
    pets: string
    cooking: string
  }
  verified: boolean
}

// Thông tin phòng cho thuê
interface RoomListing {
  id: string
  title: string
  location: string
  district: string
  rent: number            // VND/tháng
  distance: number        // km
  matchScore: number      // 0-100%
  images: string[]        // Unsplash URLs
  roomType: string
  bedrooms: number
  bathrooms: number
  area: number            // m²
  amenities: string[]
  description: string
  currentRoommates: Array<{
    name: string; avatar: string; tags: string[]; quote: string
  }>
  owner: { name: string; avatar: string; phone: string; responseTime: string }
  reviews: Array<{ author: string; avatar: string; rating: number; date: string; text: string }>
  rating: number
  verified: boolean
  petsAllowed: boolean
}

// Tin nhắn chat
interface ChatMessage {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
}

// Cuộc trò chuyện
interface Conversation {
  id: string
  participantName: string
  participantAvatar: string
  participantId: string
  online: boolean
  unreadCount: number
  lastMessage: string
  lastMessageTime: string
  messages: ChatMessage[]
}
```

### Dữ liệu mẫu

| Loại | Số lượng | Chi tiết |
|---|---|---|
| **Roommates** | 8 profiles | Minh, Linh, Duc, Hana, Khanh, Thao, Bao, Vy — tại Đà Nẵng |
| **Current User** | 1 | Dat Hoang, 22 tuổi, verified |
| **Rooms** | 6 listings | Studio, Private Room, Shared Room, Master Bedroom — 2.2M–8M VND |
| **Conversations** | 4 | Mỗi conversation có 3-5 tin nhắn mẫu |
| **Lifestyle Options** | 22 | Early Bird, Night Owl, Clean, Pet Lover, Gym Rat, Foodie... |

### Utility Functions

```typescript
// Format số tiền VND
formatCurrency(amount: number): string
// Ví dụ: formatCurrency(5000000) → "5,000,000 đ"
```

---

## 🎨 Hệ thống thiết kế (Design System)

**File:** `src/styles/index.css`

### Color Palette

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-primary` | `#4A90E2` | Buttons, links, active states |
| `--color-secondary` | `#2EC4B6` | Success, match scores, gradients |
| `--color-accent` | `#FF6B6B` | Warnings, low match scores |
| `--color-bg` | `#F7F9FC` | Page background |
| `--color-text` | `#1A1A2E` | Primary text |
| `--color-text-light` | `#6B7280` | Secondary text |
| `--color-text-lighter` | `#9CA3AF` | Placeholder text |

### Typography

| Font | Dùng cho |
|---|---|
| **Poppins** | Headings (h1-h6) |
| **Inter** | Body text, labels, inputs |

### Glassmorphism Classes

| Class | Effect |
|---|---|
| `.glass` | Background white/60%, blur 16px, border white/20% |
| `.glass-strong` | Background white/80%, blur 24px, border white/30% |
| `.premium-glass` | Gradient glassmorphism cho Premium page |

### Animation Classes

| Class | Effect |
|---|---|
| `.animated-gradient` | 4-color shifting background (15s loop) |
| `.btn-glow` | Radial ripple effect on click |
| `.skeleton` | Shimmer loading placeholder |
| `.premium-glow` | Gradient border glow on hover (::before pseudo) |
| `.card-lift` | Hover: translateY(-6px) + shadow increase |

### Utility Classes

| Class | Effect |
|---|---|
| `.hide-scrollbar` | Ẩn scrollbar (webkit + Firefox) |
| `.line-clamp-2` | Giới hạn text 2 dòng với ellipsis |

### Custom Scrollbar

- Thumb: màu primary (`#4A90E2`), bo tròn
- Track: transparent

---

## 🔄 Luồng hoạt động chính

### Luồng 1: Tìm và kết nối roommate

```
Trang chủ → "Find a Roommate" button
    ↓
FindRoommatePage (/find)
    ↓ Search / Filter / Sort
Thấy roommate phù hợp → Click "View Details"
    ↓
ProfilePage (/profile/:id)
    ↓ Xem thông tin, compatibility, preferences
Click "Connect"
    ↓
Trạng thái đổi thành "Connected ✓" + nút "Message" xuất hiện
    ↓
Click "Message"
    ↓
ChatPanel slide-in → Bắt đầu trò chuyện
```

### Luồng 2: Tìm phòng trọ

```
Trang chủ → Card "Nearby Rooms" hoặc "View All →"
    ↓
ViewAllRoomsPage (/rooms)
    ↓ Filter theo budget, distance, room type, amenities
Click vào room card
    ↓
Modal chi tiết phòng mở ra
    ↓ Xem carousel ảnh, amenities, reviews, roommates hiện tại
Click "Book a Viewing" hoặc "Send Message" cho chủ phòng
```

### Luồng 3: Đăng phòng

```
Navbar → "Post Room" hoặc Trang chủ → "Post a Room Slot"
    ↓
PostRoomPage (/post)
    ↓
Bước 1: Nhập thông tin phòng (title, location, rent, type, slots, date)
    ↓ Next
Bước 2: Chọn lifestyle expectations cho roommate mong muốn
    ↓ Next
Bước 3: Viết mô tả chi tiết
    ↓ Next
Bước 4: Review tất cả thông tin → "Publish Post"
    ↓
Success screen → "Post Another" hoặc quay lại trang chủ
```

### Luồng 4: Chat

```
Cách mở chat:
  A) Navbar → Click icon tin nhắn (💬)
  B) ProfilePage → Connect → Message
  C) ViewAllMatchesPage → Connect → Message

ChatPanel mở ra (slide-in từ phải)
    ↓
Sidebar trái: Danh sách conversations (search, select)
    ↓
Khu vực phải: Messages (scroll, read)
    ↓
Gõ tin nhắn → Enter (hoặc click Send)
    ↓
Message thêm vào conversation → Auto-scroll xuống
    ↓
Click backdrop hoặc X → Đóng panel
```

### Luồng 5: Premium (Sinh viên)

```
Navbar → "Premium" link
    ↓
PremiumPage (/premium) — mặc định tab Sinh viên
    ↓
Hero hiển thị: "Tìm bạn cùng phòng hoàn hảo"
    ↓
Bảng so sánh Miễn phí vs Trả phí
    ↓
4 gói giá: 49k (1w) / 69k (1w+AI) / 149k (1m) / 169k (1m+AI)
    ↓
Chọn gói → "Mua ngay" → (TODO: Payment integration)
    ↓
Testimonials sinh viên → FAQ sinh viên
```

### Luồng 6: Premium (Chủ trọ)

```
PremiumPage (/premium) → Click tab "Chủ trọ"
    ↓
Content animated chuyển sang giao diện chủ trọ
    ↓
Section 1: Đẩy tin trang nhất (19k/tin hoặc 149k/10 tin)
    ↓
Section 2: Mở khóa liên hệ SV (Free/3 · 99k/30 · 249k/100)
    ↓
Chọn gói → "Mua ngay" / "Nâng cấp" → (TODO: Payment)
    ↓
Testimonials chủ trọ → FAQ chủ trọ
```

### Luồng 6: Page Transitions

```
Mọi chuyển trang đều có animation:
    ↓
AnimatePresence (App.tsx) detect route change
    ↓
Current page: opacity 1→0, y 0→10 (exit)
    ↓
New page: opacity 0→1, y 10→0 (enter)
    ↓
Duration: 0.3s ease-in-out
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Hành vi |
|---|---|
| **Mobile** (< 768px) | 1 cột grid, hamburger menu, filter drawer, chat full-width |
| **Tablet** (768-1024px) | 2 cột grid, sidebar có thể collapse |
| **Desktop** (> 1024px) | 2-3 cột grid, sticky sidebar, full layout |

---

## 🗂 Routes Map

| Path | Page | Mô tả |
|---|---|---|
| `/` | LandingPage | Trang chủ marketing |
| `/find` | FindRoommatePage | Tìm kiếm roommate |
| `/post` | PostRoomPage | Đăng phòng (wizard) |
| `/profile` | ProfilePage (own) | Hồ sơ bản thân |
| `/profile/:id` | ProfilePage (view) | Xem hồ sơ người khác |
| `/rooms` | ViewAllRoomsPage | Danh sách phòng |
| `/matches` | ViewAllMatchesPage | Danh sách matches |
| `/premium` | PremiumPage | Gói Premium |

---

## 📝 Ghi chú phát triển

- **Dữ liệu hiện tại**: Tất cả dùng mock data (JSON), chưa kết nối backend/API
- **Authentication**: Chưa có hệ thống đăng nhập/đăng ký
- **Payment**: Trang Premium chưa có tích hợp thanh toán
- **Real-time chat**: Hiện tại là state-based, chưa có WebSocket
- **Image upload**: Chưa hỗ trợ upload ảnh phòng/avatar
- **Notifications**: Chưa có hệ thống thông báo real-time

---

> **MyRoomie** — Find your perfect roommate match 🏠  
> Made with ❤ in Da Nang, Vietnam
