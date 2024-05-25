// View and access different routes for the user's store.

'use client'

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"
import Link from "next/link";


export function MainNav({
    className,
    ...props
// This is type annocation that accepts any HTML attribute that can be applied to any HTML element.
// Includes common attributes like className, style, id, etc.
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            // use the strict equality operator. checks both the value and type.
            active: pathname === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            // use the strict equality operator. checks both the value and type.
            active: pathname === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            // use the strict equality operator. checks both the value and type.
            active: pathname === `/${params.storeId}/settings`
        },
    ];

    return (
        <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
};