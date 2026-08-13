'use client';

import { useState } from 'react';
import AddToCartButton from './AddToCartButton';

type ProductOption = {
  name: string;
  values: string[];
};

type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

export default function ProductForm({
  options,
  variants,
  productTitle,
  price,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
  productTitle: string;
  price: string;
}) {
  // Initialize state with an empty selection so the user has to select a size
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showError, setShowError] = useState(false);

  // If there are no configured options (only the default "Title"), just use the first variant
  const isDefaultVariant = options.length === 0;
  
  const selectedVariant = isDefaultVariant 
    ? variants[0] 
    : variants.find((variant) =>
        variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value)
      );

  const isAllOptionsSelected = isDefaultVariant || options.every((opt) => selectedOptions[opt.name]);

  const handleOptionSelect = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
    setShowError(false);
  };

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* Options selectors */}
      {options.map((option) => (
        <div key={option.name}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              SELECT {option.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              // Check if this option is available in combination with other currently selected options
              // (Simplified check: just check if any variant exists with this value)
              const isAvailable = variants.some((v) => 
                v.selectedOptions.some((o) => o.name === option.name && o.value === value) && v.availableForSale
              );

              return (
                <button
                  key={value}
                  onClick={() => handleOptionSelect(option.name, value)}
                  disabled={!isAvailable}
                  className={`min-w-[4rem] px-4 py-3 text-sm font-mono tracking-widest border transition-all duration-200 uppercase ${
                    isSelected
                      ? 'border-white bg-white text-black'
                      : isAvailable
                      ? 'border-white/20 bg-transparent text-gray-300 hover:border-white/60 hover:text-white'
                      : 'border-white/10 bg-transparent text-white/20 cursor-not-allowed'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Add To Cart Section */}
      <div className="flex flex-col gap-4">
        {showError && !isAllOptionsSelected && (
          <p className="text-red-500 text-sm font-mono animate-pulse">
            PLEASE SELECT A {options.find((opt) => !selectedOptions[opt.name])?.name.toUpperCase()} BEFORE ADDING TO CART
          </p>
        )}

        <AddToCartButton 
          variantId={selectedVariant?.id} 
          productTitle={productTitle} 
          price={price} 
          onMissingVariant={() => setShowError(true)}
        />
      </div>
    </div>
  );
}
