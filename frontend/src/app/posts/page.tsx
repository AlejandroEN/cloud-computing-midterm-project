import { MainSidebar } from "@/components/main-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <>
      <MainSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <p className="text-2xl font-bold">Trending</p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div>
        </div>
      </SidebarInset>
    </>
  );
}
