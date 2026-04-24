# NexCommerce Premium 💎

NexCommerce is a high-conversion, premium E-commerce Progressive Web App (PWA) built with **Next.js 16**, **Tailwind CSS v4**, and **Express**. It features a stunning **Glassmorphism UI** and a specialized **Single-Tunnel Architecture** for seamless local development and remote testing via Ngrok.

![License](https://img.shields.io/badge/license-MIT-amaranth)
![Framework](https://img.shields.io/badge/Framework-Next.js%2016-black)
![Style](https://img.shields.io/badge/Style-Tailwind%20v4-blue)

## ✨ Features

- 📱 **Fully Installable PWA**: Works on iOS, Android, and Desktop with offline support.
- 🎨 **Aesthetic Design**: Premium Amaranth-themed Glassmorphism UI with smooth Framer Motion animations.
- ⚡ **Real-time Notifications**: Instant order updates and seller notifications via Socket.io.
- 📄 **Invoice Generation**: Automated PDF invoice generation for every order.
- 🔐 **Dual Auth Flows**: Custom Firebase-backed authentication for both Customers and Sellers.
- 📦 **Order Management**: Real-time order tracking and status updates.
- 🔗 **Single-Tunnel Proxy**: Development setup that routes API and WebSockets through a single Ngrok tunnel.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Socket.io, PDFKit.
- **Database**: Firebase Firestore.
- **PWA**: `@ducanh2912/next-pwa`.
- **Tunneling**: Ngrok.

## 🛠️ Configuration

### 1. Backend Setup
Create a `.env` file in `apps/backend/`:
```env
PORT=5000
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

### 2. Frontend Setup
Create a `.env` file in `apps/frontend/`:
```env
NEXT_PUBLIC_SOCKET_URL="" 
```

## 🏃 Getting Started

### Installation
Run the following from the root directory:
```bash
npm run install:all
```

### Development (Single Tunnel)
To run the full-stack app with PWA features enabled:
1. Start the project:
   ```bash
   npm run pwa:start
   ```
2. In a separate terminal, start Ngrok on the frontend port:
   ```bash
   ngrok http 3000
   ```

## 📱 Installation Steps (PWA)

### iOS (Safari)
1. Open the Ngrok URL in Safari.
2. Tap the **Share** button.
3. Tap **"Add to Home Screen"**.

### Android (Chrome)
1. Open the Ngrok URL in Chrome.
2. Tap the **Three Dots** menu.
3. Tap **"Install App"**.

## 📁 Repository Structure

```text
NexCommerce/
├── apps/
│   ├── frontend/     # Next.js 16 Client
│   └── backend/      # Express API & Sockets
├── public/           # Shared static assets
└── package.json      # Monorepo scripts
```

