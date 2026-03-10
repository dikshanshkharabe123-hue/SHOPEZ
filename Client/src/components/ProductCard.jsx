import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const finalPrice = product.price - product.discount;
  const discountPercent = product.discount > 0 
    ? Math.round((product.discount / product.price) * 100) 
    : 0;

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.mainImg} alt={product.title} />
          {discountPercent > 0 && (
            <span className="discount-badge">-{discountPercent}%</span>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.title}</h3>
          <p className="product-category">{product.category}</p>
          
          <div className="product-pricing">
            <span className="final-price">${finalPrice.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="original-price">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;