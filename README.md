## 🏗️ Technical Architecture

The system architecture of the application is divided into **three main layers: Frontend, Backend, and Database**.

---

### 📊 Architecture Diagram

```
        ┌──────────────────────────┐
        │          USER            │
        │      (Web Browser)       │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │        FRONTEND          │
        │        (React.js)        │
        │--------------------------│
        │ • User Authentication    │
        │ • Products               │
        │ • Cart                   │
        │ • Profile                │
        │ • Admin Dashboard        │
        └─────────────┬────────────┘
                      │
                HTTP API Requests
                      │
                      ▼
        ┌──────────────────────────┐
        │         BACKEND          │
        │     Node.js + Express    │
        │--------------------------│
        │ • Users API              │
        │ • Orders API             │
        │ • Products API           │
        │ • Admin Authentication   │
        │ • Admin Dashboard        │
        └─────────────┬────────────┘
                      │
                      ▼
        ┌──────────────────────────┐
        │        DATABASE          │
        │         MongoDB          │
        │--------------------------│
        │ • Users Collection       │
        │ • Cart Collection        │
        │ • Orders Collection      │
        │ • Products Collection    │
        └──────────────────────────┘
```

---

### Frontend

The **Frontend** represents the user interface of the application where users interact with the platform.
It includes several UI components responsible for displaying data and handling user actions.

Main components include:

* **User Authentication** (Login and Registration)
* **Products** (Product listing and details)
* **Cart** (Add and remove items from cart)
* **Profile** (User account information)
* **Admin Dashboard** (Admin controls and management)

The frontend communicates with the backend by sending **HTTP requests to API endpoints**.

---

### Backend

The **Backend** manages the application's business logic and API services.
It processes requests coming from the frontend and interacts with the database.

The backend consists of API endpoints responsible for:

* **Users API**
* **Orders API**
* **Products API**

It also includes:

* **Admin Authentication**
* **Admin Dashboard functionalities**

The backend ensures secure communication between the frontend and database.

---

### Database

The **Database layer** stores all the application data.
The database maintains collections that store information related to the platform.

Main collections include:

* **Users**
* **Cart**
* **Orders**
* **Products**

These collections store and manage all user activities, product information, and order details.

---

### System Workflow

1. The user interacts with the **Frontend interface**.
2. The frontend sends a request to the **Backend API**.
3. The backend processes the request and communicates with the **Database**.
4. The database returns the requested data.
5. The backend sends the response back to the **Frontend**.
6. The frontend updates the interface for the user.

---

### Architecture Summary

Frontend → User Interface Components
Backend → API Services & Business Logic
Database → Data Storage for Users, Products, Cart, and Orders
