import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SidebarInset } from "@/components/ui/sidebar";
import { PostSidebar } from "./_components/post-sidebar";

export default function Page() {
  return (
    <>
      <PostSidebar />

      <SidebarInset>
        <main className="flex flex-1">
          <Carousel>
            <CarouselContent>
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
              <CarouselItem>...</CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </main>
      </SidebarInset>
    </>
  );
}
