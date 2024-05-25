// This is the page located at http://localhost:3000/[storeId]/billboards/[billboardId]
// This is a server component.

import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params
}: {
  // How do we know billboardId is a param? It's bc this page is inside the [billboardId] folder.
  // This means that billboardId is a dynamic parameter that can vary based on the URL path.
  params: { billboardId: string }
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: {
      // No need to check whether billboard exists. We'll determine later to show a new form (does not exist),
      // or an edit form (does exist).
      id: params.billboardId
    }
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm 
          initialData={billboard}
        />
      </div>
    </div>
  )
}

export default BillboardPage;