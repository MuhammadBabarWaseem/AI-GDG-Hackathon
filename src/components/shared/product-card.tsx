import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/80 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full aspect-square">
          <Image
            src={product.imageUrl || `https://placehold.co/400x400.png`}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="product image"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-2 line-clamp-2">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3 font-body">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge variant="secondary" className="text-base font-semibold font-body">
          ${product.price.toFixed(2)}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
