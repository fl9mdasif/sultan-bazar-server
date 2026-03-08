# 🌿 Sultan Bazar (সূলতান বাজার) - E-Commerce Platform


**Sultan Bazar** is a full-featured, high-performance E-Commerce platform built for selling 100% natural spices, oils, and cooking essentials. Designed with a robust architecture and a beautiful modern user interface, the platform offers a seamless shopping experience for customers and powerful management tools for administrators.


## ✨ Key Features

### 🛒 Core E-Commerce Flow
- **Product Management**: Support for product tags, categories, descriptions, price management (regular vs. discount prices), and variant tracking.
- **Shopping Cart**: Real-time cart management synchronized with backend APIs.
- **Checkout System**: Integrated billing/shipping address forms and payment method processing (e.g., Cash on Delivery).

### 👥 Multi-Role Dashboards

The application employs a strict Role-Based Access Control (RBAC) system with distinct interfaces:

#### 1. User Dashboard (Customer)
![User Orders System](https://i.ibb.co.com/LXH5kxz4/order-user.png)
- **At-a-glance Stats**: Quick view of Total Orders, Pending, Processing, Shipped, Delivered, and Cancelled orders.
- **Live Order Tracking**: A dynamic, visual progress bar (`Placed -> Confirmed -> Processing -> Shipped -> Delivered`) that updates in real-time via RTK Query polling (5s intervals).
- **Product Reviews**: Customers can leave transparent reviews for successfully delivered products natively from their "To Review" tab.
- **Quick Cancellations**: Option to cancel orders directly from the dashboard before they are processed.
- **Account Settings**: Dedicated profile management to update personal information, securely change passwords, and manage default shipping/billing addresses.

#### 2. Admin Dashboard
![Admin Dashboard](https://i.ibb.co.com/N6mNvpZv/admin-dashboard.png)
- **Analytics Hub**: 
  - Dual-Axis **Sales Composed Chart** (Revenue Area + Order Volume Line graph) tracking trends over time.
  - **Order Status Pie Chart** visually breaking down the lifecycle distribution of current orders.
- **Financial Metrics**: Real-time revenue calculation aggregating successfully delivered orders. 
- **Entity Management**: Full CRUD interfaces to manage Products, Categories, Users, and moderate incoming Orders (status updates).
- **Admin Settings**: Options to modify administrator profile details and manage core store configurations.
- **Sidebar Navigation**: Centralized, sticky navigation drawer (mobile-friendly) linking directly to:
  - **Dashboard**: High-level overview & analytics.
  - **Categories & Products**: Inventory control and tag grouping.
  - **Orders**: Full transaction lifecycle management and fulfillment.
  - **Users**: CRM interface to view all registered customers and their history.
  - **Settings**: Store and profile configurations.

#### 3. Superadmin Dashboard
- Features all privileges of the standard Admin, plus enhanced system control, global settings management, and the ability to oversee other administrators.

---

## 🏗️ System Highlights & Engineering Decisions

1. **Hydration & Reliability**: Next.js hydration boundaries are strictly managed using `suppressHydrationWarning` at the root, preventing third-party browser extensions from crashing the initial DOM render state.
2. **Real-time UX Strategy**: Instead of heavyweight WebSockets for order tracking, the app utilizes RTK Query's built-in `pollingInterval` on targeted views (like the User's Active Orders). This provides the illusion of real-time updates when an Admin changes a status, without sacrificing server resources.
3. **Component Reusability**: Complex layouts like `OrdersList` handle their own internal data-tabbing logic cleanly while utilizing highly specific UI sub-components (like `OrderStatusTracker`).
4. **Optimized Typing**: Complex external library dependencies (like Recharts formatting callbacks) are effectively typed to prevent production-build crashes while retaining strict TS compiler rules elsewhere.

---


## 🚀 Tech Stack

### Frontend Architecture
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - Server-Side Rendering (SSR) & Static Site Generation (SSG) for optimal SEO and performance.
- **State Management**: [Redux Toolkit (RTK) & RTK Query](https://redux-toolkit.js.org/) - Efficient client state management and real-time backend data fetching with built-in caching and polling mechanisms.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/) - Utility-first styling with accessible, highly customizable UI components.
- **Data Visualization**: [Recharts](https://recharts.org/) - dynamic, responsive SVGs for sales and order analytics.
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend Architecture
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Language**: TypeScript - End-to-end type safety across the entire stack.
- **Authentication**: JWT (JSON Web Tokens) with role-based routing (Customer, Admin, Superadmin).

---

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB instance running locally or via MongoDB Atlas
- Git

### 1. Backend Setup (`/sultan-bazar-server`)
```bash
cd sultan-bazar-server
npm install

# Create a .env file and add your MongoDB URI, JWT Secrets, etc.
# PORT=5000
# DATABASE_URL=mongodb_uri_here

npm run dev
```

### 2. Frontend Setup (`/sultan-bazar-client`)
```bash
cd sultan-bazar-client
npm install

# Create a .env file pointing to the backend API
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

npm run dev
```

The client will be available at `http://localhost:3000` and the server at `http://localhost:5000`.

---
*Built with ❤️ for a seamless, natural shopping experience.*
