import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { MultiImagesDropzone } from "./MultipleImagesDropzone";

export function NavImages() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Imágenes</SidebarGroupLabel>

			<SidebarMenu>
				<MultiImagesDropzone />
			</SidebarMenu>
		</SidebarGroup>
	);
}
