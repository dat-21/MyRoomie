# MyRoomie — Nền tảng tìm bạn cùng phòng thông minh

> **MyRoomie** là ứng dụng web giúp sinh viên và người đi làm tại Đà Nẵng tìm kiếm bạn cùng phòng phù hợp dựa trên lối sống, sở thích và ngân sách. Ứng dụng sử dụng thuật toán matching thông minh để đề xuất những người bạn cùng phòng tương thích nhất.

---

## Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
  - [Hệ thống xác thực & phân quyền](#hệ-thống-xác-thực--phân-quyền)
  - [API Layer & Mock Mode](#api-layer--mock-mode)
  - [Đa ngôn ngữ (i18n)](#đa-ngôn-ngữ-i18n)
  - [Hệ thống thiết kế (Design System)](#hệ-thống-thiết-kế-design-system)
- [Tổng quan tính năng](#tổng-quan-tính-năng)
- [Routes & Layouts theo Role](#routes--layouts-theo-role)
- [Chi tiết từng trang](#chi-tiết-từng-trang)
- [Chi tiết Components](#chi-tiết-components)
- [Service Layer](#service-layer)
- [Custom Hooks](#custom-hooks)
- [Luồng hoạt động chính](#luồng-hoạt-động-chính)

---

## Công nghệ sử dụng

| Công nghệ | Phiên bản | Mục đích |
|---|---|---|
| **React** | 19.2.4 | UI Framework |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Vite** | 7.3.1 | Build tool & Dev server |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS (via `@tailwindcss/vite`, không cần config file) |
| **Framer Motion** | 12.34.2 | Animation library |
| **React Router DOM** | 7.13.0 | Client-side routing |
| **i18next / react-i18next** | 25.x / 16.x | Đa ngôn ngữ (VI/EN) |
| **Lucide React** | 0.574.0 | Icon library |
| **@fontsource/poppins** | 5.x | Font cho headings |
| **@fontsource/inter** | 5.x | Font cho body text |

---

## Cài đặt & Chạy dự án

```bash
# 1. Clone repository
git clone <repo-url>
cd MyRoomie

# 2. Cài đặt dependencies
npm install

# 3. Chạy development server (mock mode — không cần backend)
npm run dev

# 4. Build production
npm run build

# 5. Preview production build
npm run preview
```

Ứng dụng chạy tại `http://localhost:5173`.

**Tài khoản demo:**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@myroomie.vn` | `admin123` |
| Landlord | `landlord@myroomie.vn` | `password` |
| Tenant | `tenant@myroomie.vn` | `password` |

---

## Cấu trúc thư mục

```
MyRoomie/
├── docs/
│   └── API_LAYER.md            # Tài liệu kiến trúc API layer (tiếng Việt)
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── admin/              # Components chỉ dùng cho Admin dashboard
│   │   │   ├── AdminBarChart.tsx
│   │   │   ├── AdminLineChart.tsx
│   │   │   ├── AdminPieChart.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminStatsCard.tsx
│   │   │   ├── AdminUserModal.tsx
│   │   │   └── AdminUserTable.tsx
│   │   ├── AuthCard.tsx        # Card wrapper cho Login/Register
│   │   ├── ChatPanel.tsx       # Panel chat slide-in (2 cột)
│   │   ├── EmptyState.tsx      # Empty state UI
│   │   ├── Footer.tsx          # Footer 4 cột
│   │   ├── LanguageSwitcher.tsx # Toggle VI/EN
│   │   ├── LandlordInteractivePricing.tsx # Bảng giá tương tác cho landlord
│   │   ├── LandlordSidebar.tsx # Sidebar nav cho landlord layout
│   │   ├── MatchCircle.tsx     # Vòng tròn % tương thích (SVG animated)
│   │   ├── Modal.tsx           # Modal overlay tái sử dụng
│   │   ├── Navbar.tsx          # Navigation bar (sticky, responsive)
│   │   ├── ProfileRatings.tsx  # Hiển thị ratings & số liệu profile
│   │   ├── ReviewCard.tsx      # Card hiển thị một review
│   │   ├── ReviewForm.tsx      # Form viết review với star rating
│   │   ├── RoomDetailContent.tsx # Nội dung chi tiết phòng (dùng trong Modal)
│   │   ├── RoommateCard.tsx    # Card hiển thị thông tin roommate
│   │   ├── SkeletonCards.tsx   # Shimmer loading placeholders
│   │   ├── SocialMatchCard.tsx # Card match dạng social feed
│   │   └── StarRating.tsx      # Component chọn số sao
│   ├── contexts/
│   │   └── AuthContext.tsx     # Auth state, useAuth() hook, role-based logic
│   ├── data/
│   │   ├── mockData.ts         # Mảng dữ liệu mock (KHÔNG import trực tiếp trong component)
│   │   └── adminData.ts        # Mảng dữ liệu mock cho admin
│   ├── hooks/
│   │   ├── useInView.ts        # IntersectionObserver — trigger animation khi scroll vào
│   │   └── useCountUp.ts       # rAF-based count-up animation
│   ├── i18n/
│   │   ├── index.ts            # Cấu hình i18next (VI mặc định, EN fallback)
│   │   ├── vi.json             # Bản dịch tiếng Việt
│   │   └── en.json             # Bản dịch tiếng Anh
│   ├── layouts/
│   │   ├── TenantLayout.tsx    # Layout cho tenant (Navbar + Footer + ChatPanel)
│   │   └── LandlordLayout.tsx  # Layout cho landlord (LandlordSidebar)
│   ├── lib/
│   │   ├── constants.ts        # LIFESTYLE_OPTIONS, DISTRICTS, ROOM_TYPES, AMENITY_OPTIONS
│   │   ├── format.ts           # formatCurrency() — format VND
│   │   └── index.ts            # Barrel export
│   ├── pages/
│   │   ├── AdminPage.tsx           # Dashboard quản trị (chỉ admin)
│   │   ├── DesignSystemPage.tsx    # Trang demo Design System
│   │   ├── FindRoommatePage.tsx    # Tìm bạn cùng phòng (filter + sort)
│   │   ├── LandingPage.tsx         # Trang chủ (tenant/unauthenticated)
│   │   ├── LandlordHomePage.tsx    # Dashboard landlord
│   │   ├── LandlordPremiumPage.tsx # Trang Premium riêng cho landlord
│   │   ├── LandlordRoomsPage.tsx   # Quản lý phòng cho thuê
│   │   ├── LoginPage.tsx           # Trang đăng nhập (chọn role)
│   │   ├── PostRoomPage.tsx        # Đăng phòng (wizard 4 bước)
│   │   ├── PremiumPage.tsx         # Trang Premium cho tenant
│   │   ├── ProfilePage.tsx         # Hồ sơ cá nhân (xem/sửa + xem người khác)
│   │   ├── RegisterPage.tsx        # Trang đăng ký
│   │   ├── RoleSelectionPage.tsx   # Chọn role khi chưa đăng nhập
│   │   ├── RoomDetailPage.tsx      # Chi tiết phòng (full-page)
│   │   ├── UserDetailPage.tsx      # Chi tiết người dùng (full-page)
│   │   ├── ViewAllMatchesPage.tsx  # Tất cả matches (grid + filter)
│   │   └── ViewAllRoomsPage.tsx    # Tất cả phòng (grid + filter)
│   ├── services/
│   │   ├── api.ts                  # apiRequest(), mockDelay(), IS_MOCK_MODE
│   │   ├── admin.service.ts        # Admin data operations
│   │   ├── auth.service.ts         # Login, register, logout, restoreSession
│   │   ├── chat.service.ts         # Conversations & messages
│   │   ├── room.service.ts         # Rooms CRUD
│   │   ├── roommate.service.ts     # Roommates & reviews
│   │   └── index.ts                # Barrel export
│   ├── styles/
│   │   └── index.css               # CSS tokens, utility classes, animations
│   ├── types/
│   │   └── index.ts                # Tất cả TypeScript interfaces (nguồn duy nhất)
│   ├── App.tsx                     # Root routing (phân nhánh theo role)
│   └── main.tsx                    # Entry point — BrowserRouter + AuthProvider
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── CLAUDE.md                       # Hướng dẫn cho Claude Code AI
└── README.md
```

---

## Kiến trúc hệ thống

### Hệ thống xác thực & phân quyền

`src/contexts/AuthContext.tsx` cung cấp `useAuth()` hook. Auth state được lưu vào `localStorage` (key: `myroomie_auth`). Có 3 role:

| Role | Layout | Trang gốc | Mô tả |
|---|---|---|---|
| `tenant` | `TenantLayout` (Navbar + Footer + ChatPanel) | `LandingPage` | Người thuê phòng, tìm bạn |
| `landlord` | `LandlordLayout` (sidebar nav) | `LandlordHomePage` | Chủ trọ, quản lý phòng |
| `admin` | Standalone (không layout) | `AdminPage` | Quản trị viên nền tảng |
| Chưa đăng nhập | `TenantLayout` | `RoleSelectionPage` | Chọn role để đăng nhập/đăng ký |

`TenantLayout` sở hữu state `chatOpen` và truyền `onChatOpen` xuống `Navbar` và `ChatPanel`.

### API Layer & Mock Mode

Toàn bộ dữ liệu đi qua **service layer** (`src/services/`). Cơ chế chuyển đổi mock ↔ real API:

```
VITE_API_URL không set  →  IS_MOCK_MODE = true  →  trả mock data sau 300ms delay
VITE_API_URL được set   →  IS_MOCK_MODE = false →  gọi API thật qua apiRequest()
```

Để chuyển sang backend thật: set `VITE_API_URL=https://api.myroomie.vn/v1` trong `.env.production`. **Không cần sửa bất kỳ component nào.** Chi tiết xem `docs/API_LAYER.md`.

### Đa ngôn ngữ (i18n)

- Cấu hình tại `src/i18n/index.ts` (i18next + react-i18next)
- Ngôn ngữ mặc định: **Tiếng Việt** (`vi`), fallback: Tiếng Anh (`en`)
- Các file dịch: `src/i18n/vi.json` và `src/i18n/en.json`
- Tuỳ chọn ngôn ngữ lưu vào `localStorage` (key: `language`)
- Component dùng `useTranslation()` hook, toggle bằng `<LanguageSwitcher />`

### Hệ thống thiết kế (Design System)

**File:** `src/styles/index.css`

#### Color Palette

| Token | Hex | Dùng cho |
|---|---|---|
| `--color-primary` | `#4A90E2` | Buttons, links, active states |
| `--color-secondary` | `#2EC4B6` | Success, match scores, chat bubbles |
| `--color-accent` | `#FF6B6B` | Warnings, low match scores |
| `--color-bg` | `#F7F9FC` | Page background |
| `--color-text` | `#1A1A2E` | Primary text |

#### Typography

| Font | Dùng cho |
|---|---|
| **Poppins** | Headings (h1–h6), via `font-[family-name:var(--font-family-heading)]` |
| **Inter** | Body text, labels, inputs |

#### Utility Classes

| Class | Effect |
|---|---|
| `.glass` | Background white/60%, blur 16px, border white/20% |
| `.glass-strong` | Background white/80%, blur 24px, border white/30% |
| `.premium-glass` | Gradient glassmorphism cho Premium page |
| `.animated-gradient` | 4-color shifting background (15s loop) |
| `.skeleton` | Shimmer loading placeholder |
| `.card-lift` | Hover: translateY(-6px) + shadow tăng |
| `.line-clamp-2` | Giới hạn text 2 dòng với ellipsis |
| `.hide-scrollbar` | Ẩn scrollbar (webkit + Firefox) |

#### Animations

Framer Motion được dùng xuyên suốt:
- Page transitions: `AnimatePresence mode="wait"` với `opacity`/`y` variants (0.3s)
- Scroll-triggered: hook `useInView` + `useCountUp`
- Spring animations: Modal, ChatPanel, tab switches

---

## Tổng quan tính năng

| # | Tính năng | Mô tả |
|---|---|---|
| 1 | **Matching thông minh** | Tính % tương thích dựa trên lối sống, sở thích, ngân sách |
| 2 | **Tìm kiếm & Lọc nâng cao** | Lọc theo giới tính, ngân sách, ngày chuyển vào, lifestyle tags |
| 3 | **Duyệt phòng trọ** | Xem danh sách phòng với hình ảnh, tiện ích, giá cả, reviews |
| 4 | **Chi tiết phòng (Full-page)** | Carousel ảnh, thông tin roommates hiện tại, reviews, booking card |
| 5 | **Đăng phòng trọ** | Wizard 4 bước: thông tin → sở thích → mô tả → xác nhận |
| 6 | **Hồ sơ cá nhân** | Xem/chỉnh sửa hồ sơ, xem hồ sơ người khác |
| 7 | **Kết nối & Nhắn tin** | Connect → Message → Chat Panel slide-in |
| 8 | **Chat UI** | Giao diện chat 2 cột (danh sách conversations + khu vực tin nhắn) |
| 9 | **Premium theo Role** | Tenant: 4 gói tìm bạn (có/không AI). Landlord: đẩy tin + mở khóa liên hệ |
| 10 | **Admin Dashboard** | Quản lý users, phòng, reviews; biểu đồ thống kê |
| 11 | **Đa ngôn ngữ** | Tiếng Việt / Tiếng Anh, toggle real-time |
| 12 | **Xác thực (mock)** | Login/Register phân theo 3 role; session persist qua localStorage |
| 13 | **Responsive design** | Mobile-first, tương thích mọi kích thước màn hình |

---

## Routes & Layouts theo Role

### Tenant & Unauthenticated — `TenantLayout`

| Path | Page | Ghi chú |
|---|---|---|
| `/` | `RoleSelectionPage` hoặc `LandingPage` | Phụ thuộc vào auth |
| `/find` | `FindRoommatePage` | Filter/sort roommates |
| `/rooms` | `ViewAllRoomsPage` | Filter/sort listings |
| `/rooms/:id` | `RoomDetailPage` | Full-page chi tiết phòng |
| `/matches` | `ViewAllMatchesPage` | Grid matches + connect |
| `/post` | `PostRoomPage` | Wizard 4 bước |
| `/profile` | `ProfilePage` | Hồ sơ bản thân |
| `/profile/:id` | `ProfilePage` | Hồ sơ người khác |
| `/user/:id` | `UserDetailPage` | Chi tiết người dùng |
| `/premium` | `PremiumPage` | Gói premium cho tenant |

### Landlord — `LandlordLayout` (sidebar nav)

| Path | Page |
|---|---|
| `/` | `LandlordHomePage` |
| `/rooms` | `LandlordRoomsPage` |
| `/premium` | `LandlordPremiumPage` |

### Admin — Standalone (không layout)

| Path | Page |
|---|---|
| `/admin` | `AdminPage` |

### Auth — Standalone

| Path | Page |
|---|---|
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |

---

## Chi tiết từng trang

### Trang chủ (Landing Page) — `/`

**File:** `src/pages/LandingPage.tsx`

Layout Hero 2 cột:

| Cột trái | Cột phải |
|---|---|
| Badge, Heading, Mô tả | Card **Nearby Rooms** — 3 phòng gần nhất |
| 2 CTA: "Find a Roommate" + "Post a Room Slot" | Card **Best Matches** — top 3 roommates (sort theo compatibility) |
| Thống kê: 2.5K+ users / 89% match / 1.2K+ matches | |

Sections tiếp theo: "How It Works" (3 bước) → "Features" (6 tính năng) → CTA Banner gradient.

---

### Tìm bạn cùng phòng — `/find`

**File:** `src/pages/FindRoommatePage.tsx`

- **Search**: Real-time theo tên, bio, location
- **Sort**: Compatibility / Budget low→high / Budget high→low / Move-in Date
- **Filter Sidebar** (sticky desktop / drawer mobile):
  - Giới tính (All / Male / Female)
  - Ngân sách (dual range 0–15M VND)
  - Ngày chuyển vào (date picker)
  - Lifestyle Tags (22 tags, toggle multi-select)
- **Kết quả**: Grid 2 cột dùng `<RoommateCard>`, loading skeleton, empty state
- **Filter chips**: Hiện active filters với nút × xóa riêng lẻ hoặc "Reset All"

---

### Xem tất cả phòng — `/rooms`

**File:** `src/pages/ViewAllRoomsPage.tsx`

- **Room Card**: Thumbnail, verified badge, room type, match score, địa chỉ, stats (bed/bath/area), giá, rating
- **Filter**: Ngân sách, khoảng cách (slider), loại phòng, ngày chuyển vào, tiện ích (11 options)
- **Sort**: Best Match / Nearest / Lowest Price / Highest Price / Top Rated
- **Click card**: Mở Modal `<RoomDetailContent>`

---

### Chi tiết phòng — `/rooms/:id`

**File:** `src/pages/RoomDetailPage.tsx`

Full-page (không dùng Modal) với:
- Image carousel fullscreen (click ảnh → xem toàn màn hình)
- Layout 2 cột: nội dung (trái) + booking card sticky (phải)
- Sections: Quick stats, Current roommates, Description, Amenities, Reviews (có form đánh giá)
- **Similar rooms**: Load từ `getRooms()`, filter theo district/roomType

---

### Chi tiết người dùng — `/user/:id`

**File:** `src/pages/UserDetailPage.tsx`

Full-page với:
- Compatibility ring animated lớn (SVG 144px)
- Thông tin chi tiết: bio, ngân sách, lifestyle tags, 7 living preferences
- Reviews tab: danh sách + form viết review
- Connect/Message flow → mở ChatPanel
- Sidebar phải: "Hồ sơ tương tự" (top 3 roommates theo compatibility)
- Tính matching dựa trên preferences và lifestyleTags

---

### Hồ sơ cá nhân — `/profile` & `/profile/:id`

**File:** `src/pages/ProfilePage.tsx`

**Xem hồ sơ người khác** (`/profile/:id`):
- Header: avatar, tên, tuổi, nghề nghiệp, vị trí
- Compatibility circle animated
- Lifestyle tags, 7 living preferences
- Connect → Message flow

**Hồ sơ bản thân** (`/profile`):
- View mode: toàn bộ thông tin + "Matching Score Preview" (top 4 roommates phù hợp)
- Edit mode: sửa bio (textarea) + toggle lifestyle tags
- Nút Save / Cancel

---

### Xem tất cả matches — `/matches`

**File:** `src/pages/ViewAllMatchesPage.tsx`

- Grid 3 cột dùng `<RoommateCard>`
- Filter: Giờ ngủ, mức độ sạch sẽ, hút thuốc, lifestyle tags
- Sort: Best Match / Budget / Move-in Date
- Connect/Message flow tích hợp trên mỗi card

---

### Đăng phòng — `/post`

**File:** `src/pages/PostRoomPage.tsx`

Wizard 4 bước với progress bar animated:
1. **Room Details**: Tiêu đề, vị trí, giá, loại phòng, số slot, ngày chuyển vào
2. **Preferences**: Multi-select lifestyle tags mong muốn ở roommate
3. **Description**: Textarea mô tả (tối đa 500 ký tự)
4. **Review**: Tổng hợp → "Publish Post" → Success screen

---

### Trang Premium Tenant — `/premium`

**File:** `src/pages/PremiumPage.tsx`

Tabs: Sinh viên / Chủ trọ (animated layoutId).

**Tab Sinh viên — 4 gói:**

| Gói | Thời hạn | Nhắn tin | AI | Giá |
|---|---|---|---|---|
| 1 Tuần | 7 ngày | 15 người | Không | 49,000đ |
| 1 Tuần + AI | 7 ngày | 15 người | Có | 69,000đ |
| 1 Tháng | 30 ngày | 60 người | Không | 149,000đ |
| 1 Tháng + AI | 30 ngày | 60 người | Có | 169,000đ |

**Tab Chủ trọ — 2 nhóm:**
- Đẩy tin: 19,000đ/tin (24h) hoặc 149,000đ/10 tin
- Mở khóa liên hệ SV: Free/3 · 99,000đ/30 · 249,000đ/100

Kèm bảng so sánh, testimonials, FAQ accordion (thay đổi theo tab).

---

### Landlord Dashboard — `/` (role landlord)

**File:** `src/pages/LandlordHomePage.tsx`

- Thống kê nhanh: tổng phòng, số lượt xem, doanh thu, đánh giá
- Danh sách phòng đang cho thuê (tải từ `getLandlordRooms()`)
- Quick actions: Đăng phòng mới, xem tất cả phòng

---

### Quản lý phòng Landlord — `/rooms` (role landlord)

**File:** `src/pages/LandlordRoomsPage.tsx`

- CRUD phòng cho thuê: xem, thêm, sửa, xoá (mock)
- Mỗi phòng hiển thị: ảnh, tên, giá, trạng thái, số slot trống

---

### Admin Dashboard — `/admin`

**File:** `src/pages/AdminPage.tsx`

Sidebar navigation với các tab:

| Tab | Nội dung |
|---|---|
| Dashboard | Thống kê tổng (AdminStatsCard), biểu đồ (Pie, Bar, Line), Top Landlords, Most Active Tenants |
| Landlords | Bảng quản lý chủ trọ (AdminUserTable), modal xem/sửa (AdminUserModal) |
| Tenants | Bảng quản lý người thuê, modal xem/sửa |
| Reviews | Danh sách reviews, duyệt/từ chối/xoá |

Biểu đồ tự xây dựng (SVG thuần, không dùng thư viện chart bên ngoài):
- `AdminPieChart` — phân bổ user theo role
- `AdminBarChart` — phòng theo quận
- `AdminLineChart` — hoạt động theo tháng

---

## Chi tiết Components

### Navbar — `src/components/Navbar.tsx`

- Sticky top, glassmorphism (blur 24px)
- Active link dùng Framer Motion `layoutId` — animated underline di chuyển mượt
- Chat button với badge số tin chưa đọc
- Mobile: hamburger → dropdown
- Prop: `onChatOpen: () => void`

### ChatPanel — `src/components/ChatPanel.tsx`

Slide-in từ phải, overlay toàn màn hình (z-95).

| Cột trái | Cột phải |
|---|---|
| Search conversations | Header: tên, status, actions |
| Danh sách conversations (avatar, last message, unread badge, online dot) | Safety tip banner |
| Current user info | Messages bubbles (sent/received) |
| | Textarea input + Send button |

Props: `isOpen`, `onClose`, `initialConversationId?` (tự động select conversation khi mở).

### RoommateCard — `src/components/RoommateCard.tsx`

- Avatar (DiceBear) + verified badge
- Tên, tuổi, nghề nghiệp, vị trí, bio (2 dòng)
- Lifestyle tags (tối đa 4 + "+N more")
- Ngân sách min–max VND, ngày chuyển vào
- Compatibility ring: SVG donut + count-up + màu theo ngưỡng (85/70)
- Scroll-triggered entrance + stagger delay

### MatchCircle — `src/components/MatchCircle.tsx`

SVG donut tái sử dụng. Sizes: `sm` (56px) / `md` (64px) / `lg` (128px).

### Modal — `src/components/Modal.tsx`

- Backdrop blur + dark overlay
- Spring animation (scale 0.95→1, translateY 20→0)
- Body scroll lock khi mở
- Sizes: `md` / `lg` / `xl` / `full`

### RoomDetailContent — `src/components/RoomDetailContent.tsx`

Dùng bên trong `<Modal>`. Layout 2 cột:
- Trái: carousel ảnh, quick stats, current roommates, description, amenities, reviews + form
- Phải (sticky): giá, availability, move-in date, booking actions, owner info

### LandlordSidebar — `src/components/LandlordSidebar.tsx`

Sidebar navigation thay thế Navbar trong landlord layout. Collapsible (icon-only khi thu gọn).

### SkeletonCards — `src/components/SkeletonCards.tsx`

Shimmer loading placeholders cho danh sách roommates và phòng.

### ReviewForm — `src/components/ReviewForm.tsx`

Form viết review với `<StarRating>` click-to-rate + textarea.

---

## Service Layer

Tất cả data access đi qua `src/services/`. Import từ `"../services"` (barrel export).

| Service file | Các hàm chính |
|---|---|
| `roommate.service.ts` | `getRoommates`, `getRoommateById`, `getRoommateWithReviews`, `getReviewsByRoommateId`, `submitRoommateReview`, `getCurrentUser`, `updateCurrentUser` |
| `room.service.ts` | `getRooms`, `getRoomById`, `getLandlordRooms`, `createRoomSlot`, `updateRoomSlot`, `deleteRoomSlot`, `submitRoomReview` |
| `chat.service.ts` | `getConversations`, `getConversationById`, `sendMessage`, `startConversation` |
| `admin.service.ts` | `getAdminStats`, `getLandlords`, `getTenants`, `getAdminReviews`, `updateLandlord`, `updateTenant`, `deleteLandlord`, `deleteTenant`, `updateReviewStatus` |
| `auth.service.ts` | `login`, `register`, `logout`, `restoreSession` |

Pattern dùng trong component:

```ts
import { getRoommates } from "../services";
import type { Roommate } from "../types";

const [roommates, setRoommates] = useState<Roommate[]>([]);
useEffect(() => { getRoommates().then(setRoommates); }, []);
```

---

## Custom Hooks

### useInView — `src/hooks/useInView.ts`

```ts
const [ref, isInView] = useInView(threshold?: number)
```

IntersectionObserver one-shot — trigger 1 lần khi element vào viewport. Dùng cho scroll-triggered animations.

### useCountUp — `src/hooks/useCountUp.ts`

```ts
const count = useCountUp(target: number, duration?: number, start?: boolean)
```

rAF-based count-up 60fps. Kết hợp với `useInView`: `start={isInView}` → đếm khi scroll vào.

---

## Luồng hoạt động chính

### Luồng 1: Tìm và kết nối roommate

```
LandingPage → "Find a Roommate"
  ↓
FindRoommatePage (/find) — Search / Filter / Sort
  ↓
Click "View Details" trên RoommateCard
  ↓
UserDetailPage (/user/:id) — Xem compatibility, preferences, reviews
  ↓
Click "Connect" → badge "Connected ✓" + nút "Message"
  ↓
Click "Message" → ChatPanel slide-in
```

### Luồng 2: Tìm phòng trọ

```
LandingPage → Card "Nearby Rooms" hoặc "View All →"
  ↓
ViewAllRoomsPage (/rooms) — Filter / Sort
  ↓
Click room card → Modal RoomDetailContent
  ↓ Xem carousel, amenities, reviews
"Book a Viewing" hoặc "Send Message" cho chủ phòng
```

### Luồng 3: Đăng phòng

```
Navbar → "Post Room" hoặc LandingPage → "Post a Room Slot"
  ↓
PostRoomPage (/post)
  ↓ Bước 1: Thông tin phòng
  ↓ Bước 2: Lifestyle expectations
  ↓ Bước 3: Mô tả chi tiết
  ↓ Bước 4: Review → "Publish Post"
  ↓
Success screen
```

### Luồng 4: Xác thực

```
RoleSelectionPage (chưa đăng nhập)
  ↓ Chọn "Sinh viên" hoặc "Chủ trọ" hoặc "Admin"
LoginPage (/login)
  ↓ Nhập email + password
AuthContext.login() → authService.login() → lưu session localStorage
  ↓
Redirect theo role: LandingPage / LandlordHomePage / AdminPage
```

### Luồng 5: Page Transitions

```
Mọi chuyển trang → AnimatePresence (App.tsx) detect route change
  ↓ Current page: opacity 1→0, y 0→-12 (exit 0.3s)
  ↓ New page: opacity 0→1, y 12→0 (enter 0.3s)
```

---

## Ghi chú phát triển

| Hạng mục | Trạng thái |
|---|---|
| Backend / Real API | Chưa có — dùng mock mode (`IS_MOCK_MODE = true`) |
| Thanh toán (Premium) | UI đầy đủ — chưa tích hợp payment gateway |
| Real-time chat | State-based — chưa có WebSocket |
| Image upload | Chưa hỗ trợ — dùng Unsplash/DiceBear URLs |
| Notifications | Chưa có hệ thống thông báo |
| Chuyển sang API thật | Set `VITE_API_URL` trong `.env.production` — xem `docs/API_LAYER.md` |

---

> **MyRoomie** — Find your perfect roommate match
> Made with love in Da Nang, Vietnam
