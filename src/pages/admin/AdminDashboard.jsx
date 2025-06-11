import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Eye, Pencil, Delete, DeleteIcon } from 'lucide-react';
import EditProduct from '../../components/product/EditProduct';
import AddProduct from '../../components/product/AddProduct';
import DeleteProduct from '../../components/product/DeleteProduct';
import ViewProduct from '../../components/product/ViewDetailProduct';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { token, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Immediate check for authentication and admin status
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (!isAdmin()) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchProducts = useCallback(async () => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      const productsData = Array.isArray(data) ? data : data.data || [];
      console.log('Processed Products:', productsData);
      setProducts(productsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token && isAdmin()) {
      fetchProducts();
    }
  }, [token, isAdmin, fetchProducts]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  // Don't render anything if not authenticated or not admin
  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex justify-center items-center min-h-[50vh]'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 sm:px-10 md:px-32 py-8'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'
        >
          <strong className='font-bold'>Error!</strong>
          <span className='block sm:inline'> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto  py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Product Management</h1>
        <button
          onClick={handleAdd}
          className='bg-primary text-white px-1  py-1 md:px-4 md:py-2 rounded-md flex items-center gap-2'
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

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
        {filteredProducts.map((product) => {
          console.log('Rendering product:', product);
          return (
            <div key={product.id} className='border rounded-lg p-4'>
              <img
                src={product.image}
                alt={product.name}
                className='w-full h-48 object-cover rounded-md'
              />
              <div className='flex justify-between gap-2 my-4'>
                <div
                  className='view bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer'
                  onClick={() => handleView(product)}
                >
                  <Eye size={20}></Eye>
                  view
                </div>
                <div
                  className='edit bg-primary text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer'
                  onClick={() => handleEdit(product)}
                >
                  <Pencil size={20}></Pencil>
                  edit
                </div>
                <div
                  className='delte bg-red-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2 cursor-pointer'
                  onClick={() => handleDelete(product)}
                >
                  <Delete size={20}></Delete>
                  delete
                </div>
              </div>
              <h3 className='font-bold text-lg mb-2'>{product.name}</h3>
              <p className='text-gray-600 mb-2'>${product.price}</p>
              <p className='text-sm text-gray-500 mb-4'>
                {product.description}
              </p>
            </div>
          );
        })}
      </div>

      {isEditModalOpen && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          getData={fetchProducts}
        />
      )}

      {isAddModalOpen && (
        <AddProduct
          onClose={() => setIsAddModalOpen(false)}
          getData={fetchProducts}
        />
      )}

      {isDeleteModalOpen && selectedProduct && (
        <DeleteProduct
          product={selectedProduct}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          getData={fetchProducts}
        />
      )}

      {isViewModalOpen && selectedProduct && (
        <ViewProduct
          product={selectedProduct}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
