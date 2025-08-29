import React, { FC } from "react";
import Image from "next/image";

interface ProductGridImageDisplayProps {
  id?: string;
  slides: string[]; // Assuming slides are now just URLs
  imageAlternativeName: string;
}

const ProductGridImageDisplay: FC<ProductGridImageDisplayProps> = ({
  slides,
  imageAlternativeName,
}) => {
  if (!slides || slides.length === 0) {
    return <div className="aspect-[4/5] bg-gray-100 rounded-lg" />;
  }

  // For simplicity, just display the first image.
  // A full carousel implementation would be more complex.
  const imageUrl = slides[0];

  return (
    <div className="w-full">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-50 relative">
        <Image src={imageUrl} alt={imageAlternativeName} fill className="object-cover" />
      </div>
    </div>
  );
};

export default ProductGridImageDisplay;
