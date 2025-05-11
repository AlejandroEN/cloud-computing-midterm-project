"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavTagsItem } from "../_types";

export function NavTags({ tags }: { tags: NavTagsItem[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tags</SidebarGroupLabel>
      <SidebarMenu>
        {tags.map((tag, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <div>
                <tag.icon />
                <span>{tag.title}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
