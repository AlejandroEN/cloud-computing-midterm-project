import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SellSidebar } from "./_components/sell-sidebar";

export default function Page() {
	return (
		<>
			<SellSidebar />

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 z-10">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
					</div>
				</header>

				<main className="flex justify-center flex-1 items-center -mt-15 ">
					<div className="flex bg-accent flex-col w-5/6 h-11/12 rounded-4xl p-5">
						<p className="font-bold text-xl">Vista previa</p>
					</div>
				</main>
			</SidebarInset>
		</>
	);
}
