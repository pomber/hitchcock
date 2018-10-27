import React from 'react';

export const Spinner = ({ size }) => {
  const fontSize = size === 'large' ? '28px' : '14px';
  return (
    <div className="Spinner" style={{ fontSize, lineHeight: fontSize }}>
      {'🌀'}
    </div>
  );
};
