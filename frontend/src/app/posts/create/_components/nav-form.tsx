"use client";

import { Input } from "@/components/ui/input";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";

export function NavForm() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Obligatorio</SidebarGroupLabel>

			<SidebarMenu>
				<Input placeholder="Título" />
				<Input placeholder="Descripción" />
				<Input placeholder="Precio" />
			</SidebarMenu>
		</SidebarGroup>
	);
}
