// Route used to update or delete billboards.

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    // We can always access the storeId because of the folder structure. It's taken from there.
    { params } : { params: { storeId: string }}
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', {status: 401});
        }

        if (!label) {
            return new NextResponse('Label is required', {status: 400});
        }

        if (!imageUrl) {
            return new NextResponse('Image URL is required', {status: 400});
        }

        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400});
        }

        // Check if the storeId checks for the specific user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Unauthorized', {status: 403});
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboard)
    }
    catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse('Internal error', {status: 500})
    }
}

export async function GET(
    req: Request,
    // We can always access the storeId because of the folder structure. It's taken from there.
    { params } : { params: { storeId: string }}
) {
    try {
        if (!params.storeId) {
            return new NextResponse('Store ID is required', {status: 400});
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        })
        return NextResponse.json(billboards)
    }
    catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse('Internal error', {status: 500})
    }
}