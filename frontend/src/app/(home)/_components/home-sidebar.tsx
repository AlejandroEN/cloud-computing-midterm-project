"use client";

import { NavFilters } from "@/app/(home)/_components/nav-filters";
import { NavQuickAccess } from "@/app/(home)/_components/nav-quick-access";
import { NavTags } from "@/app/(home)/_components/nav-tags";
import { NavUser } from "@/app/(home)/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Bell,
  DollarSign,
  Home,
  LifeBuoy,
  Map,
  Shell,
  SortAsc,
} from "lucide-react";
import Link from "next/link";
import { ComponentProps } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import FilterSection from "./FilterSection";
import OrderBySection from "./OrderBySection";

const navMainItems: ComponentProps<typeof NavFilters>["items"] = [
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

const navTagsItems: ComponentProps<typeof NavTags>["tags"] = [
  { title: "Tag 1", icon: Map, queryValue: "tag1" },
  { title: "Tag 2", icon: Map, queryValue: "tag2" },
  { title: "Tag 3", icon: Map, queryValue: "tag3" },
] as const;

const navSecondaryItems: ComponentProps<typeof NavQuickAccess>["items"] = [
  { title: "Inicio", url: "/", icon: Home },
  { title: "Notificaciones", url: "/notificaciones", icon: Bell },
  { title: "Posts", url: "/posts", icon: Shell },
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
