import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI, adminAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Fetch featured products
      const productsResponse = await productsAPI.getAll({ limit: 8 });
      setFeaturedProducts(productsResponse.data.products);

      // Fetch categories
      const adminResponse = await adminAPI.getData();
      setCategories(adminResponse.data.adminData?.categories || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopEZ</h1>
          <p>Your Ultimate Shopping Destination</p>
          <button className="cta-button" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className="category-card"
                onClick={() => handleCategoryClick(category)}
              >
                <h3>{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Shop with Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Wide Selection</h3>
              <p>Extensive catalog of products across various categories</p>
            </div>
            <div className="feature-card">
              <h3>Secure Checkout</h3>
              <p>Safe and efficient purchasing process</p>
            </div>
            <div className="feature-card">
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="feature-card">
              <h3>Easy Returns</h3>
              <p>Hassle-free return and exchange policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;