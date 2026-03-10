import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, loading, total, updateCartItem, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity.toString());
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = (item) => {
    navigate('/order/new', { state: { item } });
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart to see them here!</p>
        <button onClick={() => navigate('/products')} className="shop-now-btn">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={handleClearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => {
              const itemTotal = (item.price - item.discount) * parseInt(item.quantity);
              
              return (
                <div key={item._id} className="cart-item">
                  <img src={item.mainImg} alt={item.title} className="item-image" />
                  
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    {item.description && <p className="item-description">{item.description}</p>}
                    {item.size && <p className="item-size">Size: {item.size}</p>}
                    
                    <div className="item-pricing">
                      <span className="price">${(item.price - item.discount).toFixed(2)}</span>
                      {item.discount > 0 && (
                        <span className="original-price">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => handleQuantityChange(item._id, parseInt(item.quantity) - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item._id, parseInt(item.quantity) + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      <strong>Total: ${itemTotal.toFixed(2)}</strong>
                    </div>

                    <div className="item-actions">
                      <button 
                        onClick={() => handleCheckout(item)} 
                        className="checkout-item-btn"
                      >
                        Buy Now
                      </button>
                      <button 
                        onClick={() => handleRemove(item._id)} 
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Cart Summary</h2>
            <div className="summary-row">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row total-row">
              <strong>Total:</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="continue-shopping-btn" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;