import { getTrendingPosts as getPosts } from "@/api/post";
import { HomeSidebar } from "@/app/(home)/_components/home-sidebar";
import Post from "@/components/Post";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

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
						{posts.map((product, index) => (
							<Post key={index} />
						))}
					</div>
				</div>
			</SidebarInset>
		</>
	);
}
