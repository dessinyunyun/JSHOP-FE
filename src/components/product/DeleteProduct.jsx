import { HandHelping, X } from 'lucide-react';
import IconWithTooltip from '../common/IconWithTooltip';
import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function DeleteProduct({ product, getData, onClose }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { token } = useAuth();

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      await getData(); // Refresh data setelah delete
      onClose(); // Tutup modal
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.message || 'Failed to delete product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='flex flex-col gap-4 bg-white p-6 rounded-md shadow-lg w-80 md:w-96'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold'>Delete Product</h3>
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
        <p>Are you sure you want to delete "{product.name}"?</p>
        <div className='flex justify-end gap-2'>
          <button
            className='bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400 transition-colors'
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className='bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className='animate-spin h-4 w-4 text-white'
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
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
