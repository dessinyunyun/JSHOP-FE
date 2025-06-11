import { useState, useCallback } from 'react';
import { api } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.products.getAll();
      if (response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.products.create(productData);
      if (response.data) {
        setProducts((prev) => [...prev, response.data]);
      }
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.products.update(id, productData);
      if (response.data) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? response.data : product
          )
        );
      }
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await api.products.delete(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}; 