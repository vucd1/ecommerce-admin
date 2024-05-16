// The combobox in the navbar that's used to switch to different stores the user owns.
'use client'

import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"; // added thru shadcn


import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/use-store-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
    Command, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandList,
    CommandItem, 
    CommandSeparator
} from "@/components/ui/command";


// PopoverTrigger refers to the Shadcn component. typeof returns the type of PopoverTrigger.
// ComponentPropsWithoutRef extracts all props types that PopoverTrigger accepts except for the 'ref' prop.
// Therefore, PopoverTriggerProps is a TypeScript type that represents the props accepted by the PopoverTrigger component.
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

// This interface inherits all the props that PopoverTriggerProps defines.
interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher({
    className, // inherited from PopoverTriggerProps
    items = [] // default value of empty array
}: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    // Format items by returning an object with label and value
    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    // Find which of these stores are currently selected
    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    // Define what happens when the user clicks on a different store
    const [open, setOpen] = useState(false);
    const onStoreSelect = (store: { value: string, label: string}) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* Popover.Content is going to position against PopoverTrigger */}
            <PopoverTrigger asChild>
                {/* Build the Current Store button that opens a drop down menu with a search bar. */}
                <Button
                    variant='outline'
                    size='sm'
                    // Role, aria-expanded, and aria-label are for assistive technologies
                    role='combobox'
                    aria-expanded={open}
                    aria-label='Select a store'
                    className={cn('w-[200px] justify-between', className)}
                >
                    <StoreIcon className='mr-2 h-4 w-4' />
                    {currentStore?.label}
                    <ChevronsUpDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>

            {/* This is the popup that shows after you click on the Current Store button. */}
            <PopoverContent className='w-[200px] p-0' >
                {/* Command component is just the selectable drop down menu. */}
                <Command>
                    <CommandList>
                        <CommandInput placeholder='Search store...' />
                        {/* Case scenario for when there are no stores. */}
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading='Stores'>
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                    className='text-sm'
                                >
                                    <StoreIcon className='mr-2 h-4 w-4' />
                                    {store.label}
                                    <Check 
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            currentStore?.value === store.value ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />

                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                                >
                                <PlusCircle className='mr-2 h-5 w-5' />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
