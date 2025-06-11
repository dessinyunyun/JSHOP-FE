import { X } from 'lucide-react';
import IconWithTooltip from '../common/IconWithTooltip';

export default function ViewDetailProduct({ product, onClose }) {
  console.log('View Product Data:', product); // Log product data in view modal

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'>
      <div className='flex flex-col gap-4 bg-white p-6 rounded-md shadow-lg w-80 md:w-96'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='font-bold text-xl'>Product Details</h3>
          <IconWithTooltip
            icon={X}
            tooltipText='Close'
            onClick={onClose}
            iconClass='text-red-500'
          />
        </div>

        <div className='flex flex-col gap-4'>
          <div className='w-full h-48 overflow-hidden rounded-md'>
            <img
              src={product.image}
              alt={product.name}
              className='w-full h-full object-cover'
            />
          </div>

          <div className='space-y-2'>
            <h4 className='text-lg font-semibold'>{product.name}</h4>
            <p className='text-primary font-bold'>${product.price}</p>
            <div className='text-sm text-gray-600'>
              <p className='font-medium mb-1'>Description:</p>
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        <div className='flex justify-end mt-4'>
          <button
            onClick={onClose}
            className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
