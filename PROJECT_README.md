# ShopEZ - E-Commerce Platform

A full-stack e-commerce application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Features
- **User Authentication**: Register and login with JWT-based authentication
- **Product Browsing**: Browse products with filtering by category, gender, and search
- **Product Details**: View detailed product information with image carousel
- **Shopping Cart**: Add products to cart, update quantities, and manage cart items
- **Order Management**: Place orders with shipping details and payment method selection
- **User Profile**: View and edit profile information, track order history

### Admin Features
- **Admin Dashboard**: View statistics (total users, products, orders, revenue)
- **Product Management**: Add, edit, and delete products
- **Order Management**: View all orders and update order status
- **User Management**: View and manage registered users
- **Settings**: Manage banner images and product categories

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **Vite** - Build tool

## Project Structure

```
SHOPEZ/
├── Server/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── Client/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Profile.jsx
    │   │   ├── OrderDetails.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── App.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the Server directory:
```bash
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Server directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopez
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get user profile (Protected)
- `PUT /profile` - Update user profile (Protected)

### Product Routes (`/api/products`)
- `GET /` - Get all products (with filtering & pagination)
- `GET /category/:category` - Get products by category
- `GET /:id` - Get single product
- `POST /` - Create product (Admin only)
- `PUT /:id` - Update product (Admin only)
- `DELETE /:id` - Delete product (Admin only)

### Cart Routes (`/api/cart`)
- `GET /` - Get cart items (Protected)
- `POST /` - Add item to cart (Protected)
- `PUT /:itemId` - Update cart item (Protected)
- `DELETE /:itemId` - Remove item from cart (Protected)
- `DELETE /` - Clear cart (Protected)

### Order Routes (`/api/orders`)
- `POST /` - Create order (Protected)
- `GET /` - Get user orders (Protected)
- `GET /all` - Get all orders (Admin only)
- `GET /:orderId` - Get single order (Protected)
- `PUT /:orderId/status` - Update order status (Admin only)
- `PUT /:orderId/cancel` - Cancel order (Protected)

### Admin Routes (`/api/admin`)
- `GET /data` - Get admin data (banner, categories)
- `PUT /data` - Update admin data (Admin only)
- `GET /dashboard` - Get dashboard stats (Admin only)
- `GET /users` - Get all users (Admin only)
- `DELETE /users/:userId` - Delete user (Admin only)

## Database Schema

### User
```javascript
{
  username: String (required, unique),
  password: String (required),
  email: String (required, unique),
  usertype: String (default: 'customer')
}
```

### Product
```javascript
{
  title: String (required),
  description: String (required),
  mainImg: String (required),
  carousel: Array,
  sizes: Array,
  category: String (required),
  gender: String,
  price: Number (required),
  discount: Number (default: 0)
}
```

### Cart
```javascript
{
  userId: String (required),
  title: String (required),
  description: String,
  mainImg: String,
  size: String,
  quantity: String (required),
  price: Number (required),
  discount: Number (default: 0)
}
```

### Order
```javascript
{
  userId: String (required),
  name: String (required),
  email: String (required),
  mobile: String (required),
  address: String (required),
  pincode: String (required),
  title: String (required),
  description: String,
  mainImg: String,
  size: String,
  quantity: Number (required),
  price: Number (required),
  discount: Number (default: 0),
  paymentMethod: String (required),
  orderDate: String,
  deliveryDate: String,
  orderStatus: String (default: 'order placed')
}
```

### Admin
```javascript
{
  banner: String,
  categories: Array
}
```

## Usage

### Creating an Admin User
To create an admin user, register a new user and then manually update the `usertype` field in the database to 'admin'.

### Adding Products
1. Login as an admin user
2. Navigate to the Admin Dashboard
3. Click on the "Products" tab
4. Fill in the product form and click "Add Product"

### Managing Orders
1. Login as an admin user
2. Navigate to the Admin Dashboard
3. Click on the "Orders" tab
4. Update order status using the dropdown menu

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

For any queries or support, please contact the development team.

---

**Built with ❤️ using the MERN Stack**