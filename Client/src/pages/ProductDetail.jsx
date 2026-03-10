import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      const productData = response.data.product;
      setProduct(productData);
      setActiveImage(productData.mainImg);
      
      // Set default size if available
      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const cartItem = {
      title: product.title,
      description: product.description,
      mainImg: product.mainImg,
      size: selectedSize,
      quantity: quantity.toString(),
      price: product.price,
      discount: product.discount
    };

    const result = await addToCart(cartItem);
    
    if (result.success) {
      setMessage('Item added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 500);
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  const finalPrice = product.price - product.discount;
  const discountPercent = product.discount > 0 
    ? Math.round((product.discount / product.price) * 100) 
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {message && <div className="message-banner">{message}</div>}
        
        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={activeImage} alt={product.title} />
              {discountPercent > 0 && (
                <span className="discount-badge">-{discountPercent}%</span>
              )}
            </div>
            
            {product.carousel && product.carousel.length > 0 && (
              <div className="image-thumbnails">
                <img 
                  src={product.mainImg} 
                  alt="Main" 
                  onClick={() => setActiveImage(product.mainImg)}
                  className={activeImage === product.mainImg ? 'active' : ''}
                />
                {product.carousel.map((img, index) => (
                  <img 
                    key={index} 
                    src={img} 
                    alt={`View ${index + 1}`}
                    onClick={() => setActiveImage(img)}
                    className={activeImage === img ? 'active' : ''}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <h1>{product.title}</h1>
            <p className="product-category">{product.category}</p>
            {product.gender && <p className="product-gender">For: {product.gender}</p>}

            <div className="product-pricing">
              <span className="final-price">${finalPrice.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="original-price">${product.price.toFixed(2)}</span>
                  <span className="discount-text">Save ${product.discount.toFixed(2)}</span>
                </>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="size-selection">
                <h4>Select Size:</h4>
                <div className="sizes">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="quantity-selection">
              <h4>Quantity:</h4>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;