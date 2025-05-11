"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { postSchema, PostSchema } from "@/schemas/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SellSidebar } from "./_components/sell-sidebar";

export default function Page() {
  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      price: 0,
      description: "",
    },
  });
  const title = form.watch("title");
  const price = form.watch("price");
  const description = form.watch("description");

  return (
    <>
      <SellSidebar form={form} />

      <SidebarInset>
        <header className="z-10 flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <main className="-mt-15 flex flex-1 items-center justify-center">
          <div className="bg-accent flex h-11/12 w-5/6 flex-col rounded-4xl p-5">
            <p className="text-xl font-semibold">Vista previa</p>

            <div className="flex-ro border-neutral my-2 flex flex-1 rounded-4xl border-2">
              <div className="bg-background flex flex-1/4 items-center justify-center rounded-l-4xl">
                <div className="flex w-5/6 flex-col items-center gap-4">
                  <p className="text-2xl font-bold text-gray-500">
                    Vista previa de tu publicación
                  </p>

                  <p className="text-center text-xl text-gray-500">
                    A medida que crees la publicación, podrás ver qué aspecto
                    tendrá en Marketplace.
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-6 rounded-r-4xl p-3">
                <p className="text-2xl font-bold">{title || "Título"}</p>

                <div className="flex flex-col gap-3">
                  <p className="text-xl font-semibold">
                    {price === 0 ? "Precio" : `S./ ${price}`}
                  </p>

                  <p>Publicado hace unos segundos.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-xl font-semibold">Detalles</p>
                  <p>{description || "La descripción aparecerá aquí."}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xl font-semibold">
                    Información del vendedor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}
