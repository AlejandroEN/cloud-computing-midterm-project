import Post from "@/components/Post";
import Link from "next/link";
import { ComponentProps } from "react";

const posts: ComponentProps<typeof Post>[] = [
  {
    title: "Post 1",
    tags: ["tag1", "tag2"],
    price: 19.99,
    rating: 4.5,
  },
  {
    title: "Post 2",
    tags: ["tag3", "tag4"],
    price: 29.99,
    rating: 3.8,
  },
  {
    title: "Post 3",
    tags: ["tag5", "tag6"],
    price: 39.99,
    rating: 4.2,
  },
  {
    title: "Post 4",
    tags: ["tag7", "tag8"],
    price: 49.99,
    rating: 4.0,
  },
];

export default async function Page() {
  return (
    <>
      <p className="text-2xl font-bold">Trending</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post, index) => (
          <Link key={index} href={`/posts/${index}`}>
            <Post key={index} {...post} />
          </Link>
        ))}
      </div>
    </>
  );
}
