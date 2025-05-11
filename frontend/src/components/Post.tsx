import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface PostProps {
  thumbnailUrl?: string;
  title: string;
  tags: string[];
  stars?: number;
  price: number;
  rating: number;
}

export default function Post(props: PostProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={props.thumbnailUrl || "/placeholder.png"}
          alt={props.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{props.title}</h3>
        {/* <p className="text-sm text-muted-foreground">
					{product.category}
				</p> */}
        <div className="mt-1 flex items-center">
          <span className="text-sm">★ {props.rating}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {props.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="font-bold">S/. {props.price.toFixed(2)}</span>
        <Button size="sm">Comprar</Button>
      </CardFooter>
    </Card>
  );
}
