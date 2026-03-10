import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI, productsAPI, ordersAPI } from '../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Dashboard stats
  const [stats, setStats] = useState({});

  // Products
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    mainImg: '',
    carousel: '',
    sizes: '',
    category: '',
    gender: '',
    price: '',
    discount: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Users
  const [users, setUsers] = useState([]);

  // Admin settings
  const [adminData, setAdminData] = useState({
    banner: '',
    categories: []
  });
  const [categoryInput, setCategoryInput] = useState('');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }

    fetchDashboardData();
  }, []);

  useEffect(() => {
    switch (activeTab) {
      case 'products':
        fetchProducts();
        break;
      case 'orders':
        fetchOrders();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'settings':
        fetchAdminData();
        break;
      default:
        break;
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 100 });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAllOrders({});
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers({});
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
      const response = await adminAPI.getData();
      setAdminData(response.data.adminData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  // Product handlers
  const handleProductFormChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...productForm,
      carousel: productForm.carousel ? productForm.carousel.split(',').map(s => s.trim()) : [],
      sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : [],
      price: parseFloat(productForm.price),
      discount: parseFloat(productForm.discount) || 0
    };

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, productData);
        alert('Product updated successfully!');
      } else {
        await productsAPI.create(productData);
        alert('Product created successfully!');
      }

      setProductForm({
        title: '',
        description: '',
        mainImg: '',
        carousel: '',
        sizes: '',
        category: '',
        gender: '',
        price: '',
        discount: ''
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      title: product.title,
      description: product.description,
      mainImg: product.mainImg,
      carousel: Array.isArray(product.carousel) ? product.carousel.join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      category: product.category,
      gender: product.gender || '',
      price: product.price.toString(),
      discount: product.discount.toString()
    });
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsAPI.delete(productId);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      alert('Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // User handlers
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Settings handlers
  const handleAddCategory = () => {
    if (!categoryInput.trim()) return;

    setAdminData({
      ...adminData,
      categories: [...adminData.categories, categoryInput.trim()]
    });
    setCategoryInput('');
  };

  const handleRemoveCategory = (index) => {
    setAdminData({
      ...adminData,
      categories: adminData.categories.filter((_, i) => i !== index)
    });
  };

  const handleSaveSettings = async () => {
    try {
      await adminAPI.updateData(adminData);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.username}!</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-number">{stats.totalProducts || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-number">{stats.totalOrders || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">${(stats.totalRevenue || 0).toFixed(2)}</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-management">
            <div className="product-form-section">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleProductSubmit} className="admin-form">
                <input
                  type="text"
                  name="title"
                  value={productForm.title}
                  onChange={handleProductFormChange}
                  placeholder="Product Title"
                  required
                />
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  placeholder="Description"
                  required
                />
                <input
                  type="text"
                  name="mainImg"
                  value={productForm.mainImg}
                  onChange={handleProductFormChange}
                  placeholder="Main Image URL"
                  required
                />
                <input
                  type="text"
                  name="carousel"
                  value={productForm.carousel}
                  onChange={handleProductFormChange}
                  placeholder="Carousel Images (comma-separated URLs)"
                />
                <input
                  type="text"
                  name="sizes"
                  value={productForm.sizes}
                  onChange={handleProductFormChange}
                  placeholder="Sizes (comma-separated, e.g., S, M, L)"
                />
                <input
                  type="text"
                  name="category"
                  value={productForm.category}
                  onChange={handleProductFormChange}
                  placeholder="Category"
                  required
                />
                <select
                  name="gender"
                  value={productForm.gender}
                  onChange={handleProductFormChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
                <input
                  type="number"
                  name="price"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  placeholder="Price"
                  step="0.01"
                  required
                />
                <input
                  type="number"
                  name="discount"
                  value={productForm.discount}
                  onChange={handleProductFormChange}
                  placeholder="Discount"
                  step="0.01"
                />
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingProduct && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProduct(null);
                        setProductForm({
                          title: '', description: '', mainImg: '', carousel: '',
                          sizes: '', category: '', gender: '', price: '', discount: ''
                        });
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="products-list">
              <h2>All Products</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td><img src={product.mainImg} alt={product.title} width="50" /></td>
                      <td>{product.title}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>${product.discount.toFixed(2)}</td>
                      <td>
                        <button onClick={() => handleEditProduct(product)} className="edit-btn">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-management">
            <h2>All Orders</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const total = (order.price - order.discount) * order.quantity;
                  return (
                    <tr key={order._id}>
                      <td>{order._id.slice(-8)}</td>
                      <td>{order.name}</td>
                      <td>{order.title}</td>
                      <td>${total.toFixed(2)}</td>
                      <td>{order.orderStatus}</td>
                      <td>{order.orderDate}</td>
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="order placed">Order Placed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-management">
            <h2>All Users</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.usertype}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteUser(user._id)} 
                        className="delete-btn"
                        disabled={user.usertype === 'admin'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-management">
            <h2>Admin Settings</h2>
            
            <div className="settings-section">
              <h3>Banner Image URL</h3>
              <input
                type="text"
                value={adminData.banner || ''}
                onChange={(e) => setAdminData({ ...adminData, banner: e.target.value })}
                placeholder="Enter banner image URL"
                className="settings-input"
              />
            </div>

            <div className="settings-section">
              <h3>Product Categories</h3>
              <div className="category-input">
                <input
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Add new category"
                  className="settings-input"
                />
                <button onClick={handleAddCategory} className="add-btn">Add</button>
              </div>
              
              <ul className="categories-list">
                {(adminData.categories || []).map((category, index) => (
                  <li key={index}>
                    {category}
                    <button onClick={() => handleRemoveCategory(index)} className="remove-btn">
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={handleSaveSettings} className="save-settings-btn">
              Save Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;