import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import IconWithTooltip from '../common/IconWithTooltip';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

export default function EditProduct({ product, onClose, getData }) {
  console.log(product)
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: product.name || '',
    price: product.price || '',
    description: product.description || '',
    image: product.image || null,
  });

  const [previewImage, setPreviewImage] = useState(
    product.image
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Buat preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.image);

      const response = await fetch(
        `http://localhost:5000/api/products/${product.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      getData(result.data); // Panggil callback untuk update state di parent
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      setError(error.message || 'Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='flex flex-col gap-4 bg-white p-6 rounded-md shadow-lg w-80 md:w-96'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold'>Edit Product</h3>
          <IconWithTooltip
            icon={X}
            tooltipText='Close'
            onClick={onClose}
            iconClass='text-red-500'
          />
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input
            type='text'
            name='name'
            placeholder='Product Name'
            value={formData.name}
            onChange={handleChange}
            className='p-2 border rounded-md'
            required
          />
          <input
            type='number'
            name='price'
            value={formData.price}
            onChange={handleChange}
            placeholder='Price'
            className='p-2 border rounded-md'
            required
          />
          <textarea
            name='description'
            value={formData.description}
            onChange={handleChange}
            placeholder='Description'
            className='p-2 border rounded-md'
            rows={3}
            required
          ></textarea>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Product Image</label>
            <input
              type='file'
              name='image'
              accept='image/*'
              className='p-2 border rounded-md'
              onChange={handleImageChange}
            />

            {previewImage || formData.image ? (
              <div className='mt-2'>
                <img
                  src={
                    previewImage || `http://localhost:5000/${formData.image}`
                  }
                  alt='Preview'
                  className='w-20 h-20 object-cover rounded-md'
                />
                <p className='text-xs text-gray-500 mt-1'>Image Preview</p>
              </div>
            ) : null}
          </div>

          <button
            type='submit'
            className='bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors flex justify-center items-center gap-2'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
