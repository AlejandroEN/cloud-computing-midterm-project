import { getPostById } from "@/api/post";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SidebarInset } from "@/components/ui/sidebar";
import Image from "next/image";
import { PostSidebar } from "./_components/post-sidebar";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(Number(id));

  return (
    <>
      <PostSidebar post={post} />

      <SidebarInset>
        <main className="flex flex-1">
          <Carousel>
            <CarouselContent>
              {post.imagesUrls.map((url, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={url}
                    alt="Post image"
                    className="h-full w-full object-cover"
                    fill
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </main>
      </SidebarInset>
    </>
  );
}
