import { redirect } from "next/navigation";

import { UserButton, auth } from "@clerk/nextjs";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import StoreSwitcher from "@/components/store-switcher";

import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId
    }
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-2">
        <StoreSwitcher items={stores} />
        <MainNav />
        <div className="ml-auto">
          <ThemeToggle />

          <UserButton 
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </div>
  )
}

export default Navbar;