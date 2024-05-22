import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const { userId } = auth();

    if (!userId) {
        redirect(('/login'));
    }

    // Search for a store that equates to the store id in the URL params
    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    // If the store id does not exist, redirect back to the active user dashboard.
    if (!store) {
        redirect('/');
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
  )
}

export default SettingsPage;