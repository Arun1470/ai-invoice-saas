# ⚡ InvoiceAI — AI-Powered Invoice Generator SaaS

> Generate professional invoices from natural-language prompts using **Gemini AI**. A full-stack MERN SaaS with client management, payment tracking, and secure authentication.

![Tech Stack](https://img.shields.io/badge/Stack-MERN-6366f1?style=flat-square)
![AI](https://img.shields.io/badge/AI-Gemini-4285F4?style=flat-square&logo=google)
![Auth](https://img.shields.io/badge/Auth-Clerk-6c47ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 🤖 **AI Invoice Generation** — Describe your work in plain English; Gemini AI produces a complete, itemised invoice instantly
- 👥 **Client Management** — Store client profiles, track relationships and billing history
- 📊 **Real-time Dashboard** — Monitor total revenue, paid, pending, and overdue invoices at a glance
- 💳 **Payment Tracking** — Update invoice status (Draft → Sent → Paid → Overdue)
- 🔐 **Secure Auth** — Enterprise-grade authentication via Clerk (Google OAuth, email/password)
- 🖨️ **Print/Export** — Print-ready invoice layout built in
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Google Gemini 1.5 Flash |
| Auth | Clerk (webhooks + JWT) |
| Icons | Lucide React |
| HTTP | Axios |
| Notifications | React Hot Toast |

---

## 📁 Project Structure

```
ai-invoice-saas/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Layout.jsx     # Sidebar + main layout
│   │   │   ├── StatCard.jsx   # Dashboard stat cards
│   │   │   ├── InvoiceRow.jsx # Invoice table row
│   │   │   ├── EmptyState.jsx # Empty list placeholder
│   │   │   ├── Skeleton.jsx   # Loading skeletons
│   │   │   └── ConfirmDialog.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── InvoicesPage.jsx
│   │   │   ├── NewInvoicePage.jsx   # AI + manual modes
│   │   │   ├── InvoiceDetailPage.jsx
│   │   │   ├── ClientsPage.jsx
│   │   │   ├── SignInPage.jsx
│   │   │   └── SignUpPage.jsx
│   │   ├── utils/
│   │   │   ├── api.js         # Axios instance + API helpers
│   │   │   └── format.js      # Currency, date, status formatters
│   │   ├── App.jsx            # Routes
│   │   └── main.jsx           # Entry point + Clerk provider
│   └── index.html
│
└── server/                    # Express backend
    ├── controllers/
    │   ├── invoiceController.js   # CRUD + AI generation
    │   └── clientController.js
    ├── models/
    │   ├── Invoice.js
    │   ├── Client.js
    │   └── User.js
    ├── routes/
    │   ├── invoiceRoutes.js
    │   ├── clientRoutes.js
    │   ├── userRoutes.js
    │   └── webhookRoutes.js   # Clerk user sync
    ├── middleware/
    │   └── authMiddleware.js  # Clerk JWT verification
    ├── utils/
    │   ├── db.js              # MongoDB connection
    │   └── gemini.js          # Gemini AI prompt + parser
    └── index.js               # Server entry
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- [Clerk](https://clerk.com) account (free)
- [Google AI Studio](https://aistudio.google.com) API key (free)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-invoice-saas.git
cd ai-invoice-saas
```

### 2. Install dependencies

```bash
npm run install-all
```

### 3. Configure environment variables

**Server** — copy and fill in `server/.env`:
```bash
cp server/.env.example server/.env
```

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-invoice-saas
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

**Client** — copy and fill in `client/.env`:
```bash
cp client/.env.example client/.env
```

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:5000/api
```

### 4. Set up Clerk Webhook

In your Clerk dashboard → **Webhooks** → Add endpoint:
- URL: `https://your-domain.com/api/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`
- Copy the signing secret → paste as `CLERK_WEBHOOK_SECRET`

### 5. Run in development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 🤖 How AI Invoice Generation Works

1. User types a natural-language prompt in the UI:
   > *"Invoice John from Acme Corp for 20 hours of web design at $95/hr and 5 hours of consulting at $120/hr. Add 10% GST. Due in 30 days."*

2. The prompt is sent to `/api/invoices/ai-generate`

3. The server sends the prompt to **Gemini 1.5 Flash** with a structured system prompt requesting JSON output

4. The AI extracts: client details, line items, quantities, prices, tax rate, due date, and notes

5. Totals are calculated server-side, the invoice is saved to MongoDB, and returned to the frontend

---

## 📡 API Endpoints

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | List invoices (search, filter, paginate) |
| GET | `/api/invoices/:id` | Get single invoice |
| POST | `/api/invoices` | Create manually |
| POST | `/api/invoices/ai-generate` | Generate with Gemini AI |
| PUT | `/api/invoices/:id` | Update (status, fields) |
| DELETE | `/api/invoices/:id` | Delete invoice |
| GET | `/api/invoices/stats/summary` | Dashboard stats |

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |

---

## 🔒 Authentication Flow

- Clerk handles sign-up / sign-in on the frontend
- Each API request includes a Bearer JWT (`window.Clerk.session.getToken()`)
- The `requireAuth` middleware verifies the token with Clerk's SDK
- Clerk webhooks sync user creation/deletion to MongoDB

---

## 🌐 Deployment

### Backend (Railway / Render)
1. Set all environment variables from `server/.env.example`
2. Set `NODE_ENV=production`
3. Deploy the `server/` folder

### Frontend (Vercel / Netlify)
1. Set `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_API_URL` (pointing to your backend URL)
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| `/` | Landing page with feature overview |
| `/sign-in` | Clerk-powered sign in |
| `/sign-up` | Clerk-powered registration |
| `/dashboard` | Stats + recent invoices |
| `/dashboard/invoices` | Searchable, filterable invoice list |
| `/dashboard/invoices/new` | AI generator + manual form |
| `/dashboard/invoices/:id` | Invoice detail + status management |
| `/dashboard/clients` | Client management with CRUD |

---

## 🧑‍💻 About

Built by **[Your Name]** — Full Stack Developer

- Responsive UI with HTML + Tailwind CSS
- Backend development with Node.js, Express, MongoDB
- AI integration with Google Gemini
- Authentication with Clerk
- Git version control and production deployment

---

## 📄 License

MIT — feel free to use, modify, and build on this project.
