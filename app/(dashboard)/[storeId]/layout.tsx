import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function DashboardLayout({
    // These parameters are being destructured from an object.
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {
    const { userId } = auth();

    // If there's no user id, redirect to the login page.
    if (!userId) {
        redirect('/login');
    }

    // Given the storeId and userId from the parameters, fetch
    // the first record in the list that matches criteria from our database.
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId // This is a shorthand for userId: userId
        }
    });

    // If the store doesn't exist, redirect them to the root page.
    if (!store) {
        redirect('/');
    }

    return (
        <>
            <div>This will be a navbar.</div>
            {children}
        </>
    )
}