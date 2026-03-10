import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const result = await updateProfile(profileData);

    if (result.success) {
      setMessage('Profile updated successfully!');
      setEditing(false);
    } else {
      setMessage(result.message);
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'processing':
        return 'orange';
      default:
        return 'blue';
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>

        {message && <div className="message-banner">{message}</div>}

        {/* Profile Information */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Profile Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate} className="profile-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button 
                  type="button" 
                  onClick={() => {
                    setEditing(false);
                    setProfileData({
                      username: user?.username || '',
                      email: user?.email || ''
                    });
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Account Type:</strong> {user?.usertype}</p>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="orders-section">
          <h2>My Orders</h2>

          {loading ? (
            <div className="loading">Loading orders...</div>
          ) : orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((order) => {
                const orderTotal = (order.price - order.discount) * order.quantity;
                
                return (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <h3>Order #{order._id}</h3>
                        <p className="order-date">Placed on: {order.orderDate}</p>
                      </div>
                      <span 
                        className="order-status"
                        style={{ color: getStatusColor(order.orderStatus) }}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="order-product">
                      <img src={order.mainImg} alt={order.title} />
                      <div className="product-details">
                        <h4>{order.title}</h4>
                        {order.size && <p>Size: {order.size}</p>}
                        <p>Quantity: {order.quantity}</p>
                        <p>Payment: {order.paymentMethod}</p>
                      </div>
                      <div className="order-pricing">
                        <p className="order-total">${orderTotal.toFixed(2)}</p>
                      </div>
                    </div>

                    {order.deliveryDate && (
                      <p className="delivery-date">
                        Expected Delivery: {order.deliveryDate}
                      </p>
                    )}

                    <button 
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="view-details-btn"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-orders">
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/products')} className="shop-now-btn">
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;