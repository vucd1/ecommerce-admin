import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";


export default async function SetupLayout({
    children
}: {
    children: React.ReactNode
}) {
    // Extract user id from Clerk's Auth object which is returned from auth()
    const { userId } = auth();

    // If user doesn't exist, redirect to login page.
    if (!userId) {
        redirect('/login');
    }

    // Otherwise, find the first active store our user has.
    const store = await prismadb.store.findFirst({
        where: {
            userId
        }
    });

    // If that store exists, we redirect them to that store's dashboard.
    if (store) {
        redirect(`/${store.id}`);
    }

    // Otherwise, execute this fallback return
    return (
        <>
            {children}
        </>
    )
}