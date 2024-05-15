// The general navigation bar.

import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

const Navbar = async () => {
  // Retreive userId from clerk's auth().
  // auth() returns the Auth object of the currently active user.
  const {userId} = auth();

  // If user is not signed in, redirect them to the sign in page.
  if (!userId) {
    redirect('/login');
  }

  const store = await prismadb.store.findMany({
    where: {
      userId, //shorthand for userId: userId
    }
  })

  return (
    <div className='border-b'>
        <div className='flex h-16 items-center px-4'>
            <StoreSwitcher />
            <MainNav className="mx-6" />
            <div className='ml-auto flex items-center space-x-4'>
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    </div>
  )
}

export default Navbar;