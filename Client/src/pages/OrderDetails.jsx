import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [isNewOrder, setIsNewOrder] = useState(orderId === 'new');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    mobile: '',
    address: '',
    pincode: '',
    paymentMethod: 'COD',
    deliveryDate: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isNewOrder && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(orderId);
      setOrderData(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      setMessage('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location.state?.item) {
      setMessage('No item selected for order');
      return;
    }

    const item = location.state.item;

    const orderPayload = {
      ...formData,
      title: item.title,
      description: item.description,
      mainImg: item.mainImg,
      size: item.size,
      quantity: parseInt(item.quantity),
      price: item.price,
      discount: item.discount
    };

    try {
      setLoading(true);
      const response = await ordersAPI.create(orderPayload);
      
      if (response.data.success) {
        setMessage('Order placed successfully!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setLoading(true);
      await ordersAPI.cancelOrder(orderId);
      setMessage('Order cancelled successfully');
      fetchOrder(); // Refresh order
    } catch (error) {
      console.error('Error cancelling order:', error);
      setMessage('Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isNewOrder) {
    return <div className="loading">Loading order details...</div>;
  }

  // Show order form for new order
  if (isNewOrder) {
    const item = location.state?.item;

    if (!item) {
      return (
        <div className="error">
          <p>No item selected for checkout</p>
          <button onClick={() => navigate('/cart')}>Go to Cart</button>
        </div>
      );
    }

    const itemTotal = (item.price - item.discount) * parseInt(item.quantity);

    return (
      <div className="order-details-page">
        <div className="container">
          <h1>Complete Your Order</h1>

          {message && <div className="message-banner">{message}</div>}

          <div className="order-content">
            <div className="order-form-section">
              <form onSubmit={handleSubmit} className="order-form">
                <h2>Shipping Details</h2>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Expected Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method *</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    required
                  >
                    <option value="COD">Cash on Delivery</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>

                <button type="submit" className="place-order-btn" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>

            <div className="order-summary-section">
              <h2>Order Summary</h2>
              
              <div className="summary-item">
                <img src={item.mainImg} alt={item.title} />
                <div className="item-info">
                  <h3>{item.title}</h3>
                  {item.size && <p>Size: {item.size}</p>}
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${(item.price - item.discount).toFixed(2)}</p>
                </div>
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${itemTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <strong>Total:</strong>
                  <strong>${itemTotal.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show existing order details
  if (!orderData) {
    return <div className="error">Order not found</div>;
  }

  const orderTotal = (orderData.price - orderData.discount) * orderData.quantity;

  return (
    <div className="order-details-page">
      <div className="container">
        <h1>Order Details</h1>

        {message && <div className="message-banner">{message}</div>}

        <div className="order-info-card">
          <div className="order-header">
            <h2>Order #{orderData._id}</h2>
            <span className={`status-badge status-${orderData.orderStatus.replace(' ', '-')}`}>
              {orderData.orderStatus}
            </span>
          </div>

          <div className="order-dates">
            <p>Order Date: {orderData.orderDate}</p>
            {orderData.deliveryDate && <p>Expected Delivery: {orderData.deliveryDate}</p>}
          </div>

          <div className="product-info">
            <img src={orderData.mainImg} alt={orderData.title} />
            <div>
              <h3>{orderData.title}</h3>
              <p>{orderData.description}</p>
              {orderData.size && <p>Size: {orderData.size}</p>}
              <p>Quantity: {orderData.quantity}</p>
              <p>Price: ${(orderData.price - orderData.discount).toFixed(2)}</p>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p><strong>Name:</strong> {orderData.name}</p>
            <p><strong>Email:</strong> {orderData.email}</p>
            <p><strong>Mobile:</strong> {orderData.mobile}</p>
            <p><strong>Address:</strong> {orderData.address}</p>
            <p><strong>Pincode:</strong> {orderData.pincode}</p>
            <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
          </div>

          <div className="order-total">
            <h3>Total: ${orderTotal.toFixed(2)}</h3>
          </div>

          {orderData.orderStatus === 'order placed' && (
            <button onClick={handleCancelOrder} className="cancel-order-btn" disabled={loading}>
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;