import React from 'react';

const Card = ({ children, className = '', onClick, hover = false }) => {
  const hoverStyles = hover ? 'hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;