import { LucideIcon } from "lucide-react";
import { JSX } from "react";

export interface NavMainItem {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  section: JSX.Element;
}

export interface NavTagsItem {
  title: string;
  queryValue: string;
  icon: LucideIcon;
}

export interface NavSecondaryItem {
  title: string;
  url: string;
  icon: LucideIcon;
}
