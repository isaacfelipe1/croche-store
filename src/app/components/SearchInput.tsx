import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative w-full md:w-1/2">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Digite o que procura'}
        className="w-full px-4 py-2 border-2 border-gray-400 rounded-full pl-10 focus:outline-none focus:border-gray-600"
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
    </div>
  );
};

export default SearchInput;
