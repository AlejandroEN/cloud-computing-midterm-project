import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ComponentProps } from "react";

export function PostSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props} side="right">
      <SidebarHeader></SidebarHeader>

      <SidebarContent></SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
