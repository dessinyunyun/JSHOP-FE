import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuy = (product) => {
    if (!isAuthenticated()) {
      // Redirect to login page with return path
      navigate('/login', { state: { from: '/', product: product.id } });
      return;
    }
    alert(
      `Thank you for your interest in ${product.name}! This is a demo buy button.`
    );
  };

  return (
    <div className='container mx-auto py-8'>
      <h1 className='text-2xl font-bold mb-6'>Our Products</h1>

      <div className='relative mb-6'>
        <input
          type='text'
          placeholder='Search products...'
          value={searchQuery}
          onChange={handleSearch}
          className='w-full p-2 pl-10 border rounded-md'
        />
        <Search className='absolute left-3 top-2.5 text-gray-400' size={20} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className='border rounded-lg p-4 hover:shadow-lg transition-shadow'
          >
            <img
              src={product.image}
              alt={product.name}
              className='w-full h-48 object-cover rounded-md mb-4'
            />
            <h3 className='font-bold text-lg mb-2'>{product.name}</h3>
            <p className='text-gray-600 mb-2'>${product.price}</p>
            <p className='text-sm text-gray-500 mb-4'>{product.description}</p>
            <button
              onClick={() => handleBuy(product)}
              className='w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
