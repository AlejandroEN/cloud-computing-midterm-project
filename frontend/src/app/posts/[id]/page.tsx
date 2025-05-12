import { getPostById } from "@/api/post";
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
        <div className="flex flex-1 flex-col py-6">
          <Image
            src={post.imagesUrls[0]}
            alt="Post image"
            width={500}
            height={100}
          />
        </div>
      </SidebarInset>
    </>
  );
}
