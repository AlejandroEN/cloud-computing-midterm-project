import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { X } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { NavForm } from "./nav-form";
import { NavImages } from "./nav-images";

export function SellSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu className="gap-5">
					<SidebarMenuItem>
						<Link href="/">
							<X />
						</Link>
					</SidebarMenuItem>

					<SidebarMenuItem>
						<div className="flex flex-row items-center gap-2">
							<Avatar>
								<AvatarImage
									src="/avatars/shadcn.jpg"
									alt="User Avatar"
								/>
								<AvatarFallback>AV</AvatarFallback>
							</Avatar>
							<p>Alessandra Valeria Silva Ríos</p>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavImages />
				<NavForm />
			</SidebarContent>

			<SidebarFooter className="flex flex-col gap-2">
				<Button variant="outline">Crear publicación</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
