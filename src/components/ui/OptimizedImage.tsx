"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends ImageProps {
  wrapperClassName?: string;
}

export default function OptimizedImage({ wrapperClassName = "", className = "", ...props }: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={props.alt || ""}
      className={`transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={(e) => {
        setIsLoaded(true);
        if (props.onLoad) {
          props.onLoad(e);
        }
      }}
    />
  );
}
