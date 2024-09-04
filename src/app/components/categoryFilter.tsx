// src/components/CategoryFilter.tsx
"use client";
import React, { memo } from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="flex space-x-4 mb-6">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded text-gray-700 bg-[#FDFDFD] hover:bg-white focus:outline-none focus:border-[#F279A6] focus:ring-2 focus:ring-[#F279A6] hover:border-[#F279A6] transition-colors duration-200"
      >
        <option value="">Todas as Categorias</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(CategoryFilter);
