# 🚀 Deploy GitPortal Crypto Tracker ke Vercel

## Langkah-langkah (3 menit saja!)

### Step 1: Buka Vercel
Klik: https://vercel.com/login

### Step 2: Login with GitHub
- Klik "Continue with GitHub"
- Login pakai:
  - Username: gitportal89ok-collab
  - Password: (password GitHub Bos Lukman)

### Step 3: Import Project
- Setelah login, buka: https://vercel.com/new
- Cari repository: **gitportal-crypto-tracker**
- Klik **Import**

### Step 4: Configure & Deploy
- Framework: Next.js (otomatis)
- Root Directory: ./
- Build Command: npm run build (default)
- Output Directory: .next (default)

### Step 5: Tambah Environment Variables
Klik **Environment Variables** dan tambahkan:

| Name | Value |
|------|-------|
| NEXTAUTH_SECRET | sD9ak3srJlJ50juwKzgXdkNccs8ZvpWbgY0vRCpnilE= |
| NEXTAUTH_URL | https://gitportal-crypto-tracker.vercel.app |
| NEXT_PUBLIC_MOCK_MODE | true |

### Step 6: Deploy!
Klik **Deploy** → Tunggu 1-2 menit → **SELESAI!** 🎉

---

## Hasil Deploy
Setelah deploy, aplikasi bisa diakses di:
https://gitportal-crypto-tracker.vercel.app

## Fitur yang Aktif (Mock Mode)
- ✅ Dashboard dengan 10 crypto coins
- ✅ Portfolio tracking
- ✅ News feed (mock articles)
- ✅ Sentiment analysis
- ✅ On-chain analytics (mock data)
- ✅ Real-time WebSocket

---

*Dibuat oleh GitPortal AI Agent*
