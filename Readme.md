# E-Commerce Backend

This repository contains the backend for an e-commerce platform built using **Node.js**, **Express**, and **MongoDB**. It supports user and admin functionalities, including cart management, order handling, payment integration (via Stripe), and robust API endpoints.

---

## Features

### **User Functionalities**

- Create orders from their cart.
- Cancel orders (if not delivered).

### **Admin Functionalities**

- Update order statuses (e.g., `Pending → Processing → Shipped → Delivered`).
- Ensure secure role-based access for order management.

### **Product Management**

- Add, update, and delete products.
- Fetch product details for users.

## Getting Started

### **1️⃣ Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/AmmarFayed4/e-commerce_backend.git
   cd e-commerce_backend
   ```



- Install dependencies:npm install

### **2️⃣ Environment Setup**

Create a .env file in the root directory and add the following variables:
PORT=3000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_api_key

3️⃣ Start the Server
Run the application locally:
npm run dev

API Documentation
Base URL
http://localhost:3000/api

User Endpoints
1️⃣ User Authentication
Register a New User

- POST /auth/register
- Body:{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "securepassword"
  }
  

  - for admin user Body:{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "securepassword"
    "role": "Admin"
    }

- Response:{
  "message": "User registered successfully",
  "token": "jwt_token_here"
  }

Login User

- POST /auth/login
- Body:{
  "email": "johndoe@example.com",
  "password": "securepassword"
  }

- Response:{
  "message": "Login successful",
  "token": "jwt_token_here"
  }

Create Order

- POST /orders
- Headers:- Authorization: Bearer <JWT_TOKEN>

- Body:{
  "shippingAddress": "123 Main Street, City, Country"
  }

Get User Orders

- GET /orders
- Headers:- Authorization: Bearer <JWT_TOKEN>

Cancel Order

- PATCH /orders/:id/cancel
- Headers:- Authorization: Bearer <JWT_TOKEN>

Product Endpoints
Get All Products

- GET /products
- Response:[
  {
  "_id": "product_id_here",
  "name": "Product Name",
  "price": 100,
  "description": "Product description"
  }
  ]

Get Single Product

- GET /products/:id
- Response:{
  "\_id": "product_id_here",
  "name": "Product Name",
  "price": 100,
  "description": "Product description"
  }

Add New Product

- POST /products
- Headers:- Authorization: Bearer <JWT_TOKEN> (Admin role required)

- Body:{
  "name": "New Product",
  "price": 200,
  "description": "Description of the product"
  }

Update Product

- PATCH /products/:id
- Headers:- Authorization: Bearer <JWT_TOKEN> (Admin role required)

- Body:{
  "price": 150
  }

Delete Product

- DELETE /products/:id
- Headers:- Authorization: Bearer <JWT_TOKEN> (Admin role required)

Admin Endpoints
Update Order Status

- PATCH /orders/:id
- Headers:- Authorization: Bearer <JWT_TOKEN> (Admin role required)

- Body:{
  "status": "Processing"
  }

Postman Testing

- Import the API documentation into Postman to test each endpoint.
- Use your JWT tokens for the Authorization headers.

Project Structure
├── models
│ ├── Order.js
│ ├── Cart.js
│ ├── Product.js
├── controllers
│ ├── orderController.js
│ ├── productController.js
├── routes
│ ├── orderRoutes.js
│ ├── productRoutes.js
├── server.js
