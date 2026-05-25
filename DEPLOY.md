# Hướng dẫn Deploy — MyRoomie Monorepo

Repo này có cấu trúc **monorepo** gồm Frontend (Vite/React) và Backend (.NET 8).

```
MyRoomie/
├── src/              ← Frontend → deploy lên Vercel
├── backend/          ← Backend  → deploy lên Railway
└── .gitignore
```

---

## 🌐 Frontend → Vercel

### Lần đầu setup
1. Vào https://vercel.com → **"Add New Project"** → Import GitHub repo
2. Vercel tự detect **Vite** (không cần config gì thêm)
3. Thêm **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend.up.railway.app` |

4. Nhấn **Deploy**

### Mỗi lần push code mới
```bash
git push origin main
```
→ Vercel **tự động** rebuild và deploy frontend ✅

---

## 🐍 Python AI Service → Railway (Service thứ 2)

### Lần đầu setup
1. Trong cùng Railway project (đã có .NET service), nhấn **+ Create** → **GitHub repo**
2. Chọn cùng repo `MyRoomie`
3. Tab **Settings** → **Root Directory** → nhập: `ai-service`
4. Thêm **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `ALLOWED_ORIGINS` | `https://your-dotnet-service.up.railway.app` |

5. Railway sẽ detect Dockerfile và tự build
6. Lấy domain của AI service (vd: `https://ai-xxx.up.railway.app`)
7. Vào service .NET → Variables → thêm: `AI_SERVICE_URL` = domain vừa lấy

> ⚠️ Lần build đầu mất 10-15 phút vì download model InsightFace (~500MB)

---

## 🚂 Backend (.NET) → Railway

### Lần đầu setup
1. Vào https://railway.app → **"New Project"** → **"Deploy from GitHub repo"**
2. Chọn repo → Railway hỏi **"Root Directory"** → nhập: `backend/MyRoomie.API`
3. Railway tự detect `.csproj` và build với `dotnet publish`
4. Thêm **Environment Variables** trong Railway dashboard:

   | Key | Value |
   |-----|-------|
   | `ASPNETCORE_ENVIRONMENT` | `Production` |
   | `Firebase__ProjectId` | `service-accounts-3450a` |
   | `FIREBASE_SERVICE_ACCOUNT_JSON` | *(copy toàn bộ nội dung file `firebase-service-account.json`)* |
   | `Email__SenderEmail` | `hoangtrinh240705@gmail.com` |
   | `Email__AppPassword` | `kndt dxva pkbd aabr` |
   | `Email__SenderName` | `My Roomie` |
   | `Email__SmtpHost` | `smtp.gmail.com` |
   | `Email__SmtpPort` | `587` |
   | `Jwt__Key` | *(key bí mật >= 32 ký tự)* |
   | `Jwt__Issuer` | `MyRoomie` |
   | `Jwt__Audience` | `MyRoomie` |
   | `Cors__AllowedOrigins__0` | `https://your-app.vercel.app` |

5. Railway cấp domain dạng: `https://xxx.up.railway.app`
6. Cập nhật `VITE_API_URL` trên Vercel bằng domain Railway vừa có

### Mỗi lần push code mới
```bash
git push origin main
```
→ Railway **tự động** rebuild và deploy backend ✅

---

## 🔄 Workflow hàng ngày

```bash
# 1. Chỉnh code (FE hoặc BE)
# 2. Test local
# 3. Push lên GitHub
git add .
git commit -m "feat: thêm chức năng X"
git push origin main

# → Vercel tự deploy FE
# → Railway tự deploy BE
```

---

## 🖥️ Chạy local để dev

**Terminal 1 — Frontend:**
```powershell
cd D:\EXE\MyRoomie
npm run dev
# http://localhost:5173
```

**Terminal 2 — Backend:**
```powershell
cd D:\EXE\MyRoomie\backend\MyRoomie.API
dotnet run --launch-profile http
# http://localhost:5021
```

**Terminal 3 — AI Service (Python):**
```powershell
cd D:\EXE\MyRoomie\ai-service
.\.venv\Scripts\uvicorn main:app --port 8000 --reload
# http://localhost:8000
```


---

## ⚠️ Lưu ý bảo mật

- `firebase-service-account.json` → **KHÔNG** commit (đã có trong `.gitignore`)
- `appsettings.Development.json` → **KHÔNG** commit (đã có trong `.gitignore`)
- `.env.local` → **KHÔNG** commit (đã có trong `.gitignore`)
- Tất cả secrets → để trong Railway/Vercel **Environment Variables**
