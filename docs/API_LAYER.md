# Kiến Trúc API Layer — MyRoomie

Tài liệu này giải thích lớp service được xây dựng trong quá trình tái cấu trúc dự án MyRoomie, từ việc hardcode toàn bộ dữ liệu sang mô hình có thể dễ dàng chuyển sang gọi API thật.

---

## Vấn Đề Trước Khi Refactor

Trước đây, các component import trực tiếp mảng dữ liệu mock:

```ts
// ❌ Cách cũ — component phụ thuộc trực tiếp vào dữ liệu giả
import { roommates, currentUser } from "../data/mockData";
const tenant = roommates.find((r) => r.id === id);
```

Cách này có 3 vấn đề lớn:

- **Không thể swap API**: Để chuyển sang backend thật, phải sửa từng component một.
- **Dữ liệu đồng bộ**: Không mô phỏng được loading state, lỗi mạng, hay async behavior.
- **Phụ thuộc chéo**: Interfaces TypeScript bị định nghĩa rải rác trong `mockData.ts`, khó bảo trì.

---

## Giải Pháp Sau Khi Refactor

Tất cả data access đều đi qua hàm service async:

```ts
// ✅ Cách mới — component dùng service layer
import { getRoommateById } from "../services";

useEffect(() => {
  getRoommateById(id).then(setPerson);
}, [id]);
```

Service layer là **điểm nối duy nhất** giữa UI và nguồn dữ liệu. Để chuyển sang backend thật, chỉ cần thay đổi **một biến môi trường** — không cần sửa bất kỳ component hay page nào.

---

## Biến Môi Trường

| Biến           | Ý nghĩa                                               |
| -------------- | ----------------------------------------------------- |
| `VITE_API_URL` | Base URL của backend thật. Để trống = dùng mock mode. |

**`.env` (development — chạy mock):**

```
# Không set VITE_API_URL → IS_MOCK_MODE = true
```

**`.env.production` (backend thật):**

```
VITE_API_URL=https://api.myroomie.vn/v1
```

---

## Cơ Chế Hoạt Động (`src/services/api.ts`)

```ts
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
export const IS_MOCK_MODE = !API_BASE_URL;

// Gọi API thật — tự động đính kèm Bearer token từ localStorage
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestOptions,
): Promise<T>;

// Trả về dữ liệu mock sau delay giả lập (chỉ dùng trong mock mode)
export function mockDelay<T>(value: T, ms = 300): Promise<T>;
```

Mỗi hàm service đều có cấu trúc:

```ts
export async function getRoommates(): Promise<Roommate[]> {
  if (IS_MOCK_MODE) {
    return mockDelay(mockRoommates); // trả mock data sau 300ms
  }
  return apiRequest<Roommate[]>("/roommates"); // gọi API thật
}
```

---

## Các File Service

### `src/services/roommate.service.ts` — Người thuê phòng

| Hàm                                | Mock (dữ liệu từ)      | API thật                             |
| ---------------------------------- | ---------------------- | ------------------------------------ |
| `getRoommates()`                   | `mockData.roommates`   | `GET /roommates`                     |
| `getRoommateById(id)`              | filter theo id         | `GET /roommates/:id`                 |
| `getRoommateWithReviews(id)`       | join với reviews       | `GET /roommates/:id?include=reviews` |
| `getReviewsByRoommateId(id)`       | filter reviews         | `GET /roommates/:id/reviews`         |
| `submitRoommateReview(id, review)` | không làm gì           | `POST /roommates/:id/reviews`        |
| `getCurrentUser()`                 | `mockData.currentUser` | `GET /me`                            |
| `updateCurrentUser(patch)`         | không làm gì           | `PATCH /me`                          |

### `src/services/room.service.ts` — Phòng cho thuê

| Hàm                            | Mock (dữ liệu từ) | API thật                  |
| ------------------------------ | ----------------- | ------------------------- |
| `getRooms()`                   | `mockData.rooms`  | `GET /rooms`              |
| `getRoomById(id)`              | filter theo id    | `GET /rooms/:id`          |
| `getLandlordRooms()`           | lấy một phần      | `GET /rooms?owner=me`     |
| `createRoomSlot(data)`         | không làm gì      | `POST /rooms`             |
| `updateRoomSlot(id, patch)`    | không làm gì      | `PATCH /rooms/:id`        |
| `deleteRoomSlot(id)`           | không làm gì      | `DELETE /rooms/:id`       |
| `submitRoomReview(id, review)` | không làm gì      | `POST /rooms/:id/reviews` |

### `src/services/chat.service.ts` — Tin nhắn

| Hàm                                | Mock (dữ liệu từ)        | API thật                           |
| ---------------------------------- | ------------------------ | ---------------------------------- |
| `getConversations()`               | `mockData.conversations` | `GET /conversations`               |
| `getConversationById(id)`          | filter theo id           | `GET /conversations/:id`           |
| `sendMessage(convoId, text)`       | không làm gì             | `POST /conversations/:id/messages` |
| `startConversation(participantId)` | không làm gì             | `POST /conversations`              |

### `src/services/admin.service.ts` — Quản trị viên

| Hàm                              | Mock (dữ liệu từ)      | API thật                      |
| -------------------------------- | ---------------------- | ----------------------------- |
| `getAdminStats()`                | `adminData.adminStats` | `GET /admin/stats`            |
| `getLandlords()`                 | `adminData.landlords`  | `GET /admin/landlords`        |
| `getTenants()`                   | `adminData.tenants`    | `GET /admin/tenants`          |
| `getAdminReviews()`              | `adminData.reviews`    | `GET /admin/reviews`          |
| `updateLandlord(id, patch)`      | không làm gì           | `PATCH /admin/landlords/:id`  |
| `updateTenant(id, patch)`        | không làm gì           | `PATCH /admin/tenants/:id`    |
| `deleteLandlord(id)`             | không làm gì           | `DELETE /admin/landlords/:id` |
| `deleteTenant(id)`               | không làm gì           | `DELETE /admin/tenants/:id`   |
| `updateReviewStatus(id, status)` | không làm gì           | `PATCH /admin/reviews/:id`    |

### `src/services/auth.service.ts` — Xác thực

| Hàm                      | Mock                                | API thật                  |
| ------------------------ | ----------------------------------- | ------------------------- |
| `login({ email, role })` | khớp với credentials hardcode       | `POST /auth/login`        |
| `register(data)`         | luôn thành công                     | `POST /auth/register`     |
| `logout()`               | xóa localStorage                    | `POST /auth/logout`       |
| `restoreSession()`       | đọc `myroomie_auth` từ localStorage | đọc token + gọi `GET /me` |

---

## Cách Thêm Một Endpoint Mới

**Bước 1:** Định nghĩa kiểu dữ liệu mới (nếu cần) trong `src/types/index.ts`.

**Bước 2:** Thêm hàm service vào file phù hợp:

```ts
// Trong src/services/room.service.ts
export async function getTopRooms(limit = 6): Promise<RoomListing[]> {
  if (IS_MOCK_MODE) {
    return mockDelay(mockRooms.slice(0, limit));
  }
  return apiRequest<RoomListing[]>(`/rooms/top?limit=${limit}`);
}
```

**Bước 3:** Export từ barrel `src/services/index.ts`:

```ts
export { getTopRooms } from "./room.service";
```

**Bước 4:** Dùng trong component bằng `useEffect` + `useState`:

```ts
const [topRooms, setTopRooms] = useState<RoomListing[]>([]);
useEffect(() => {
  getTopRooms(6).then(setTopRooms);
}, []);
```

---

## Chuyển Sang Backend Thật

1. Set `VITE_API_URL` trong file môi trường deploy (`.env.production`).
2. Xây dựng backend với các endpoint tương ứng theo bảng ở trên.
3. Nếu backend trả về response phân trang, cập nhật hàm service để unwrap `data` từ wrapper `PaginatedResponse<T>` đã định nghĩa trong `src/types/index.ts`.
4. Token xác thực được lưu dưới key `myroomie_token` trong localStorage. Hàm `apiRequest` tự động đính kèm vào header `Authorization: Bearer <token>`.

**Không cần sửa bất kỳ component hay page nào** — chỉ có phần thân hàm service thay đổi.

---

## Các Thay Đổi Đã Thực Hiện

### 1. Tập trung TypeScript interfaces (`src/types/index.ts`)

Trước đây interface bị rải rác trong `mockData.ts` và `adminData.ts`. Bây giờ tất cả được tập trung tại một nơi:

- `Roommate`, `RoomListing`, `RoomSlot`, `ChatMessage`, `Conversation`
- `UserReview`, `RoommateWithReviews`
- `AdminUser`, `AdminLandlord`, `AdminTenant`, `AdminReview`, `AdminStats`
- `Role`, `AccountStatus`, `UserData`
- `PaginatedResponse<T>`, `ApiResponse<T>`

### 2. Tách tiện ích dùng chung (`src/lib/`)

| File               | Nội dung                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `lib/format.ts`    | `formatCurrency(amount)` — format VND bằng `Intl.NumberFormat`    |
| `lib/constants.ts` | `LIFESTYLE_OPTIONS`, `DISTRICTS`, `ROOM_TYPES`, `AMENITY_OPTIONS` |
| `lib/index.ts`     | barrel export                                                     |

### 3. Xây dựng service layer (`src/services/`)

5 file service + 1 file base client (`api.ts`) + barrel export (`index.ts`).

### 4. Cập nhật toàn bộ pages và components

Tất cả 14 page và component được cập nhật để:

- Import từ `../services` thay vì `../data/mockData`
- Import types từ `../types` thay vì định nghĩa inline
- Import `formatCurrency` từ `../lib/format` thay vì tự viết
- Dùng `useState` + `useEffect` để load dữ liệu async

### 5. Xóa file orphan

`src/index.css` bị xóa — file này không được import ở bất kỳ đâu (main.tsx dùng `./styles/index.css`).

---

## Cấu Trúc File

```
src/
├── types/
│   └── index.ts            # Tất cả TypeScript interfaces (nguồn duy nhất)
├── services/
│   ├── api.ts              # apiRequest(), mockDelay(), IS_MOCK_MODE
│   ├── roommate.service.ts
│   ├── room.service.ts
│   ├── chat.service.ts
│   ├── admin.service.ts
│   ├── auth.service.ts
│   └── index.ts            # barrel export
├── lib/
│   ├── constants.ts        # Hằng số dùng chung
│   ├── format.ts           # formatCurrency()
│   └── index.ts            # barrel export
└── data/
    ├── mockData.ts          # Chỉ chứa mảng dữ liệu mock — KHÔNG import trong component
    └── adminData.ts         # Chỉ chứa mảng dữ liệu admin mock — KHÔNG import trong component
```
