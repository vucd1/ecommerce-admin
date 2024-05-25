'use client';

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    // If a component is "mounted" in React, it means that the component has been rendered into the DOM,
    const [isMounted, setIsMounted] = useState(false);

    // useEffect sets isMounted to true after the component mounts.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If the component is not mounted, it returns null to avoid rendering any client-specific 
    // content during server-side rendering.
    if (!isMounted) {
        return null;
    }

    // This approach avoids hydration errors by ensuring the HTML content is consistent between 
    // server-side and client-side rendering.

    // If isMounted is true, this return function is to avoid hydration 
    // errors with app/layout.tsx which is a server-side rendering file.

    // Wait for SSR (server-side rendering) components to render first, then render StoreModal. 
    return (
        <>
            <StoreModal />
        </>
    )
}
