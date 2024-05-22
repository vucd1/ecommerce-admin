// Route used to update or delete the store settings.

// What are API endpoints? The URL of an API endpoint often includes the base URL of the API, 
// followed by specific paths that represent different resources or actions. For example, 
// in https://example.com/api/users, /api/users is the endpoint.

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// In Next.js, particularly when dealing with API routes, the function name in caps (e.g., 
// PATCH, GET, POST, DELETE) signifies the HTTP method that the function handles. 
// Http function: The PATCH method applies partial modifications to a resource.
export async function PATCH (
    // This is a TypeScript annotation. req is the parameter name. Request is the type of parameter.    
    req: Request,
    // storeId comes from the folder name.
    { params }: { params: { storeId: string}}
) {
    try {
        const { userId } = auth();

        // I believe this is awaiting a requst for the client AKA user's input from the website.
        const body = await req.json();
        const { name } = body; // Destructuring the body

        // Construct and return HTTP responses, including handling errors with appropriate status codes.
        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!name) {
            return new NextResponse("Name is required", {status: 400});
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", {status: 400})
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        // The purpose of this is to send a JSON of the store back to the client, after we've updated the store name.
        return NextResponse.json(store);

    }
    catch (error) {
        console.log("[STORE_PATCH]", error);

        // In Next.js, particularly when dealing with API routes, you often need to return responses to the client. 
        // NextResponse is a utility provided by Next.js to handle HTTP responses in a consistent manner. 
        // The status code indicates to the client that the server encountered an unexpected condition that 
        // prevented it from fulfilling the request. Take a look at common HTTP status codes...
        return new NextResponse("Internal error", { status: 500});
    }
}


export async function DELETE (
    // This is a TypeScript annotation. req is the parameter name. Request is the type of parameter.    
    req: Request,
    // storeId comes from the folder name.
    { params }: { params: { storeId: string}}
) {
    try {
        const { userId } = auth();

        // Construct and return HTTP responses, including handling errors with appropriate status codes.
        if (!userId) {
            return new NextResponse("Unauthenticated", {status: 401});
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", {status: 400})
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        });

        // The purpose of this is to send a JSON of the store back to the client, after we've updated the store name.
        return NextResponse.json(store);

    }
    catch (error) {
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500});
    }
}