
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="group flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border hover:border-primary rounded-lg">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-headline mb-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-4 font-body">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Badge variant="secondary" className="text-base font-semibold font-body text-accent group-hover:bg-accent/20 group-hover:border-accent/50 transition-colors">
          ${product.price.toFixed(2)}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
