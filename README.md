<div align="center">
  <img src="public/hero-isometric.png" alt="AssetFlow Dashboard Mockup" width="600" style="border-radius: 12px; margin-bottom: 20px;">

  # 📦 AssetFlow
  **Next-Generation Enterprise Asset & Resource Management System**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  
  <br />
</div>

## 🚀 Overview

**AssetFlow** is a centralized ERP platform designed to simplify and digitize how modern organizations track, allocate, and maintain their physical assets and shared resources. Built for performance and scalability, it moves organizations away from manual spreadsheets and legacy systems into a streamlined, automated, and secure digital environment.

Whether you're managing laptops in a tech startup, vehicles in a logistics company, or projectors in an educational institute, **AssetFlow** provides mathematical precision to resource overlap detection, strict Role-Based Access Control (RBAC), and automated asset mutability.

---

## 🏆 Key Features

### 🛡️ Enterprise-Grade Security & RBAC
- **Multi-tiered Roles**: `Admin`, `Asset Manager`, `Department Head`, and `Employee` tiers ensure strict access isolation.
- **Session Protection**: Next.js Middleware and JWT token validations securely protect all API endpoints and frontend routes.
- **Privilege Escalation Prevention**: Promotions and organizational setups are strictly bound to authenticated `Admin` sessions.

### 🔄 Intelligent Concurrency & Transaction Locking
- **Double-Booking Prevention**: Utilizes mathematical overlap detection (`RequestStart < ExistingEnd AND RequestEnd > ExistingStart`) wrapped inside atomic database transactions to ensure shared resources are never double-booked.
- **Atomic Allocations**: State mutations (e.g., `Available` -> `Allocated`) rely on conditional locks to prevent simultaneous assignment race conditions.

### 🤖 Smart Asset Mutability
- Assets aren't just rows in a database; they are intelligent state machines.
- **Maintenance Lifecycle**: When an asset is marked `Resolved` from maintenance, the system checks if it belongs to an active allocation and automatically routes its state back to `Allocated` instead of blindly setting it to `Available`.
- **Automated Audit Flags**: Discrepancies (Missing/Damaged) found during departmental audits automatically trigger status lockdowns (`Lost`, `Under Maintenance`).

### 📊 Real-Time Analytics & Scoped Dashboards
- **Context-Aware Dashboards**: A `Department Head` views analytics strictly scoped to their department's assets, while an `Admin` gains a macro-level organizational overview.
- **Critical Action KPIs**: Dashboards proactively highlight `Pending Maintenance Approvals`, `Audit Discrepancies`, and `Overdue Allocations`.

### ⏱️ Automated Background Cron Jobs
- A dedicated background hook (`/api/jobs/overdue`) performs daily database scans to identify and log overdue allocations across the entire organization, leaving an automated paper trail of resource bottlenecks.

---

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Framer Motion, Lucide Icons.
- **Backend**: Next.js Route Handlers (Serverless APIs).
- **Database**: SQLite (Development) via **Prisma ORM**.
- **Authentication**: Custom JWT implementation using `jose`.

### Database Schema Highlight
The system employs a tightly-coupled relational model including:
- `User` & `Department` hierarchies.
- `Asset` & `Category` mappings.
- Operational models: `Allocation`, `Booking`, `MaintenanceRequest`, `TransferRequest`, and `AuditCycle`.

---

## 🛠️ Quick Start (Local Setup)

To run **AssetFlow** locally, follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/Abhay-Paswan/AssetFlow-Enterprise-Asset-Resource-Management-System.git
cd AssetFlow-Enterprise-Asset-Resource-Management-System
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-key-for-jwt-signing"
```

**4. Run database migrations**
Synchronize the Prisma schema with the local SQLite database:
```bash
npx prisma db push
```

**5. Start the development server**
```bash
npm run dev
```
Navigate to `http://localhost:3000` to access the application.

---

## 💡 The "Why" Behind AssetFlow (Hackathon Vision)

Many resource management platforms are either overly bloated with accounting features or too simplistic to handle enterprise workflows. **AssetFlow** was engineered during this hackathon to strike the perfect balance—delivering core ERP tracking functionality with beautiful UI/UX, bulletproof backend validations, and extensible architecture. 

It acts as the single source of truth for **who** holds **what**, **where** it is, and its **condition**—empowering organizations to eliminate waste and maximize resource utilization.

---
<div align="center">
  <i>Built with passion and precision.</i>
</div>
