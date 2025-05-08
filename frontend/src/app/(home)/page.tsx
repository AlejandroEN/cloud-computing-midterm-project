import { getTrendingPosts as getPosts } from "@/api/post";
import { HomeSidebar } from "@/app/(home)/_components/home-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "lucide-react";
import Image from "next/image";

export default async function Page() {
	const posts = await getPosts();

	return (
		<>
			<HomeSidebar />

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<p className="text-2xl font-bold">Trending</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{posts.map((product) => (
							<Card key={product.id} className="overflow-hidden">
								<div className="aspect-square relative">
									<Image
										src={
											product.image || "/placeholder.svg"
										}
										alt={product.name}
										fill
										className="object-cover"
									/>
								</div>
								<CardContent className="p-4">
									<h3 className="font-semibold text-lg">
										{product.name}
									</h3>
									<p className="text-sm text-muted-foreground">
										{product.category}
									</p>
									<div className="flex items-center mt-1">
										<span className="text-sm">
											★ {product.rating}
										</span>
									</div>
									<div className="mt-2 flex flex-wrap gap-1">
										{product.tags.map((tag) => (
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
									<span className="font-bold">
										${product.price.toFixed(2)}
									</span>
									<Button size="sm">Add to cart</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</SidebarInset>
		</>
	);
}
