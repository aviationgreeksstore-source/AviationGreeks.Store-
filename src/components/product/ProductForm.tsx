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
  components?: {
    edges: Array<{
      node: {
        quantity: number;
        productVariant: {
          id: string;
          title: string;
          image?: {
            url: string;
            altText?: string;
          } | null;
          product: {
            title: string;
          };
        };
      };
    }>;
  };
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

        {selectedVariant?.components?.edges && selectedVariant.components.edges.length > 0 && (
          <div className="bg-zinc-950 border border-white/20 p-4 mt-2">
            <h3 className="text-xs font-bold font-mono tracking-[0.2em] text-white/50 border-b border-white/10 pb-2 mb-3">
              PAYLOAD MANIFEST // BUNDLE CONTENTS
            </h3>
            <ul className="space-y-3">
              {selectedVariant.components.edges.map(({ node }) => (
                <li key={node.productVariant.id} className="flex items-center gap-3">
                  {node.productVariant.image ? (
                    <img 
                      src={node.productVariant.image.url} 
                      alt={node.productVariant.image.altText || node.productVariant.title} 
                      className="w-10 h-10 object-cover bg-zinc-900 border border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center">
                      <span className="text-[8px] text-white/30 font-mono text-center">NO<br/>IMG</span>
                    </div>
                  )}
                  <div className="flex-1 flex justify-between items-center text-sm font-mono text-gray-300">
                    <div className="flex flex-col">
                      <span className="text-white truncate max-w-[200px]" title={node.productVariant.product.title}>
                        {node.productVariant.product.title}
                      </span>
                      {node.productVariant.title !== 'Default Title' && (
                        <span className="text-white/50 text-xs">
                          {node.productVariant.title}
                        </span>
                      )}
                    </div>
                    <span className="text-white font-bold ml-2">x{node.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
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
