import { Post } from "@/schemas/post";

export async function getPosts() {}

export async function getPostById(id: number): Promise<Post> {
  return {
    id: id.toString(),
    title: "Título",
    description: "Descripción",
    price: 100,
    createdAt: new Date(Date.now()),
    tags: ["tag1", "tag2"],
    imagesUrls: [
      "https://picsum.photos/id/237/200/300",
      "https://picsum.photos/id/237/200/300",
    ],
    startsAmount: 5,
  };
}
