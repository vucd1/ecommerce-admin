'use client';

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    // If isMounted is true, this return function is to avoid hydration 
    // errors with app/layout.tsx which is a server-side rendering file.
    // Wait for SSR components to render first, then render StoreModal. 
    return (
        <>
            <StoreModal />
        </>
    )
}
