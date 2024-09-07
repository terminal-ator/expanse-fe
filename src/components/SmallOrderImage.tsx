import React from 'react';
import { Product } from '../types';
import pb from '../pb';

interface SmallOrderImageProps {
  product?: Product;
}

const SmallOrderImage: React.FC<SmallOrderImageProps> = ({ product }) => {
  const imageUrl = product?.images[0] ? pb.files.getUrl(product, product.images[0], { thumb: '50x50' }) : '';
  if(!product || !imageUrl) return null;
  return (
    <div className="w-16 h-16 overflow-hidden rounded-md">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product?.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs"></span>
        </div>
      )}
    </div>
  );
};

export default SmallOrderImage;
