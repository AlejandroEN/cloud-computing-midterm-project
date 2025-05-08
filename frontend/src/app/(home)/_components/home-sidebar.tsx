"use client";

import { NavFilters } from "@/app/(home)/_components/nav-filters";
import { NavQuickAccess } from "@/app/(home)/_components/nav-quick-access";
import { NavTags } from "@/app/(home)/_components/nav-tags";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bell, DollarSign, LifeBuoy, Map, SortAsc } from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { NavMainItem, NavSecondaryItem, NavTagsItem } from "../_types";
import FilterSection from "./FilterSection";
import OrderBySection from "./OrderBySection";

const navMainItems: NavMainItem[] = [
	{
		title: "Precio",
		icon: DollarSign,
		section: <FilterSection />,
	},
	{
		title: "Ordenar por",
		icon: SortAsc,
		section: <OrderBySection />,
	},
] as const;

const navTagsItems: NavTagsItem[] = [
	{ title: "Tag 1", icon: Map, queryValue: "tag1" },
	{ title: "Tag 2", icon: Map, queryValue: "tag2" },
	{ title: "Tag 3", icon: Map, queryValue: "tag3" },
] as const;

const navSecondaryItems: NavSecondaryItem[] = [
	{ title: "Notificaciones", url: "/notificaciones", icon: Bell },
	{ title: "Ventas", url: "/ventas", icon: DollarSign },
	{ title: "Ayuda", url: "/ayuda", icon: LifeBuoy },
] as const;

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
};

export function HomeSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<Input placeholder="Buscar" />
					</SidebarMenuItem>
				</SidebarMenu>

				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Button asChild className="w-full">
								<Link href="/posts/create">Publicar</Link>
							</Button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<NavFilters items={navMainItems} />
				<NavTags tags={navTagsItems} />
				<NavQuickAccess items={navSecondaryItems} className="mt-auto" />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
