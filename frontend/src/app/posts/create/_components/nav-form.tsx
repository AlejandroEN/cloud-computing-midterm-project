import TextInput from "@/components/TextInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { CreatePost } from "@/schemas/post";
import { UseFormReturn } from "react-hook-form";

export function NavForm({ form }: { form: UseFormReturn<CreatePost> }) {
  async function onSubmit(data: CreatePost) {
    console.log(data);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Obligatorio</SidebarGroupLabel>

      <SidebarMenu className="pt-4">
        <Form {...form}>
          <form
            id="create-post-form"
            className="space-y-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <TextInput
                  field={field}
                  text="Título"
                  placeholder="Artículos, servicios, clases, etc."
                />
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>

                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder="Escribe una descripción breve de tu publicación"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <TextInput
                  field={field}
                  text="Precio"
                  placeholder="S./ "
                  type="number"
                />
              )}
            />
          </form>
        </Form>
      </SidebarMenu>
    </SidebarGroup>
  );
}
