"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Post } from "@/schemas/post";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Share } from "lucide-react";
import { ComponentProps } from "react";
import { toast } from "sonner";

interface PostSidebarProps extends ComponentProps<typeof Sidebar> {
  post: Post;
}

export function PostSidebar({ post, ...props }: PostSidebarProps) {
  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast("Post copiado al portapapeles");
  }

  return (
    <Sidebar variant="floating" {...props} side="right">
      <SidebarHeader className="gap-5 p-5">
        <p className="text-2xl font-bold">{post.title}</p>

        <div className="flex flex-row items-center gap-3 text-xl font-semibold">
          <p>S./ {post.price}</p> · <p>Disponible</p>
        </div>

        <p>
          Publicado hace{" "}
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: false,
            locale: es,
          })}
          .
        </p>

        <Button onClick={() => handleShare()}>
          <Share />
          Compartir
        </Button>
      </SidebarHeader>

      <SidebarContent className="p-5"></SidebarContent>

      <SidebarFooter className="p-5">
        <Button>Comprar</Button>
      </SidebarFooter>
    </Sidebar>
  );
}
