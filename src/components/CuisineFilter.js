// /src/components/CuisineFilter.js
import React, { useState } from 'react';
import { Button } from './ui/button';
import { FaFilter } from 'react-icons/fa';
import { regions } from '@/constants/regions'; // assuming you have a list of regions

const CuisineFilter = ({ onFilter }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleFilter = (region) => {
    setSelectedRegion(region);
    onFilter(region);  // Pass selected region to the parent component for filtering
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center">
      <Button
        className="bg-orange-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        onClick={() => handleFilter(null)}
      >
        <FaFilter /> All Cuisines
      </Button>
      {regions.map((region) => (
        <Button
          key={region}
          className={`${
            selectedRegion === region ? 'bg-orange-600' : 'bg-gray-300'
          } text-white px-6 py-2 rounded-lg`}
          onClick={() => handleFilter(region)}
        >
          {region}
        </Button>
      ))}
    </div>
  );
};

export default CuisineFilter;
