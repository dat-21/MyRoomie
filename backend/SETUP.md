# Hướng dẫn cấu hình Backend MyRoomie

## 1. Tạo Firebase Project

1. Truy cập https://console.firebase.google.com/
2. Tạo project mới (hoặc dùng project có sẵn)
3. Vào **Project Settings** → **Service Accounts**
4. Nhấn **Generate new private key** → tải về file JSON
5. Đổi tên file thành `firebase-service-account.json`
6. Đặt file vào: `d:\EXE\MyRoomie\backend\MyRoomie.API\firebase-service-account.json`

> ⚠️ **QUAN TRỌNG:** KHÔNG commit file này lên git! Đã có trong `.gitignore`.

### Firestore Setup
1. Vào **Firestore Database** → **Create database**
2. Chọn **Start in production mode**
3. Chọn region phù hợp (ví dụ: `asia-southeast1`)

---

## 2. Cấu hình Gmail App Password

1. Đăng nhập Gmail → **Manage your Google Account**
2. Vào **Security** → bật **2-Step Verification**
3. Tìm **App passwords** → tạo app password mới
4. Chọn: App = **Mail**, Device = **Windows Computer**
5. Copy 16 ký tự password được tạo

---

## 3. Cập nhật appsettings.Development.json

Mở file `appsettings.Development.json` và điền vào:

```json
{
  "Jwt": {
    "Key": "MyRoomie_SecretKey_ChangeThis_AtLeast32Characters!",
    ...
  },
  "Email": {
    "SenderEmail": "your-gmail@gmail.com",
    "AppPassword": "xxxx xxxx xxxx xxxx"
  },
  "Firebase": {
    "ProjectId": "your-firebase-project-id"
  }
}
```

---

## 4. Chạy Backend

```powershell
cd d:\EXE\MyRoomie\backend\MyRoomie.API
dotnet run
```

API sẽ chạy tại: `https://localhost:7xxx` (xem console output)
Swagger UI: `https://localhost:7xxx/swagger`

---

## 5. Kết nối Frontend

Tạo file `.env.local` trong `d:\EXE\MyRoomie\`:

```env
VITE_API_URL=https://localhost:7xxx
```

(thay `7xxx` bằng port thực tế của backend)

---

## Firestore Indexes cần tạo

Vào Firestore Console → **Indexes** → tạo composite indexes:

| Collection | Field 1 | Field 2 | Field 3 |
|-----------|---------|---------|---------|
| `users` | `Email` (ASC) | - | - |
| `otpCodes` | `UserId` (ASC) | `Purpose` (ASC) | `CreatedAt` (DESC) |
| `otpCodes` | `UserId` (ASC) | `IsUsed` (ASC) | `CreatedAt` (DESC) |

> Hoặc chạy API một lần, Firestore sẽ tự báo lỗi và cung cấp link để tạo index.
