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
			<div className="aspect-square relative">
				<Image
					src={props.thumbnailUrl || "/placeholder.png"}
					alt={props.title}
					fill
					className="object-cover"
				/>
			</div>
			<CardContent className="p-4">
				<h3 className="font-semibold text-lg">{props.title}</h3>
				{/* <p className="text-sm text-muted-foreground">
					{product.category}
				</p> */}
				<div className="flex items-center mt-1">
					<span className="text-sm">★ {props.rating}</span>
				</div>
				<div className="mt-2 flex flex-wrap gap-1">
					{props.tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="text-xs"
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="p-4 pt-0 flex items-center justify-between">
				<span className="font-bold">S/. {props.price.toFixed(2)}</span>
				<Button size="sm">Comprar</Button>
			</CardFooter>
		</Card>
	);
}
