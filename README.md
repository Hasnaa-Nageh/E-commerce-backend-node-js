#  E-commerce Backend (Node.js + Express + MongoDB)

##  Overview
This is the backend for an **E-commerce platform** built with **Node.js, Express, and MongoDB**.  
The project provides a RESTful API for managing **users, products, categories, brands, reviews, orders, carts, wishlists, addresses, and an admin dashboard**.  
It includes **JWT authentication, role-based access control, and file upload support**.

---

##  Project Structure
```
Backend/
│── config/           # Database connection
│── controllers/      # Business logic for each route
│── middleware/       # Authentication, error handling, validation
│── models/           # Mongoose schemas
│── routes/           # API routes
│── uploads/          # Uploaded product images
│── utils/            # Helper functions (e.g., tokens)
│── validation/       # Joi validation schemas
│── app.js            # Express app setup
│── index.js          # Entry point (server)
│── package.json      # Dependencies
│── README.md         # Documentation
│── .env              # Environment variables (ignored in Git)
│── .gitignore        # Files to be ignored in Git
```

---

##  Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hasnaa-Nageh/E-commerce-backend-node-js.git
   cd E-commerce-backend-node-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root folder and add:
   ```env
   PORT=PORT
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Run the server**
   - Development:
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

---

##  API Endpoints

###  Authentication & User
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login user & get token  
- `GET /api/user/` → Get all users (Admin only)  
- `GET /api/user/:id` → Get single user  
- `PUT /api/user/:id` → Update user (Admin only)  
- `DELETE /api/user/:id` → Delete user (Admin only)  

###  Products, Categories & Brands
- `GET /api/product/` → Get all products  
- `POST /api/product/` → Create product (Admin only)  
- `PUT /api/product/:id` → Update product (Admin only)  
- `DELETE /api/product/:id` → Delete product (Admin only)  

- `GET /api/category/` → Get all categories  
- `POST /api/category/` → Create category (Admin only)  

- `GET /api/brand/` → Get all brands  
- `POST /api/brand/` → Create brand (Admin only)  

###  Cart & Wishlist
- `POST /api/cart/` → Add product to cart  
- `GET /api/cart/` → Get user’s cart  
- `DELETE /api/cart/:id` → Remove item from cart  

- `POST /api/wish-list/` → Add product to wishlist  
- `GET /api/wish-list/` → Get user’s wishlist  

###  Orders
- `POST /api/order/` → Create new order  
- `GET /api/order/` → Get all orders (Admin only)  
- `PUT /api/order/:id/status` → Update order status (Admin only)  

###  Reviews
- `POST /api/review/` → Add review for product  
- `GET /api/review/:productId` → Get reviews for product  

###  Address
- `POST /api/address/` → Add user address  
- `GET /api/address/` → Get user addresses  

###  Admin Dashboard
- Manage Users, Products, Categories, Brands, Orders, and Reviews (Admin only).

---

##  Authentication
- Uses **JWT (JSON Web Token)** stored in cookies.
- **Role-based authorization**:  
  - `user` → can browse products, add to cart, order, etc.  
  - `admin` → can manage users, products, categories, brands, orders.  

---

##  File Upload
- Implemented with **Multer**.  
- Product images are stored inside `/uploads/products`.

---

##  Features
- User Authentication & Authorization (JWT + Roles)
- Product, Category, Subcategory, Brand Management
- Cart & Wishlist
- Order & Checkout System
- Review & Rating System
- Address Management
- Admin Dashboard APIs
- Error Handling Middleware
- Secure API with protected routes

---

##  Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Multer (File Uploads)**
- **Joi (Validation)**

---

##  Author
**Hasnaa Nageh**  
🔗 [GitHub Profile](https://github.com/Hasnaa-Nageh)  

