// The reason that we have a components folder to hold this component is because
// the settings page is the only page that will use this component.
// Tbh, I would have just put it in the general components folder (not this one), but alas..

"use client"

import { Billboard } from "@prisma/client";
import { Trash } from "lucide-react";
import { z } from "zod"; // For shadcn form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/ui/image-upload";

// For shadcn form
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

// For type inference. So we don't have to type the type out every time we use it.
type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData // This is needed to pass our billboard  data into this arrow function.
}) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();
    
    // Hooks for our Alert modal
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit billboard" : "Create billboard";
    const description = initialData ? "Edit a billboard" : "Add a new billboard";
    const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
    const action = initialData ? "Save changes" : "Create";

    // Zod setp for our form
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    });

    // Define a submit event handler
    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);

            // PATCH is used to partially update and existing resource with new data.
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data);
            }
            // If initialData does not exist, create a new billboard with the new data.
            else {
                await axios.post(`/api/${params.storeId}/billboards`, data);
            }

            // Triggers a reload of the current page/route in the client's browser. Useful when you
            // need to update displayed content based on new data or changes in the application state.
            router.refresh();

            // After updating, redirect user to the main billboard page.
            router.push(`/${params.storeId}/billboards`);
            toast.success(toastMessage);
        }
        catch (error) {
            toast.error("Something went wrong.");
            console.log('obsubmit settings form', error);
        }
        finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
         setLoading(true);
         await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);

         // Push user to the default root. In (root)/layout.tsx, it'll execute prismadb.store.findFirst to
         // find and redirect an existing store the user has.
         // If there are no existing stores, it'll redirect user to the Create Store Modal. This is working
         // in (root)/(routes)/page.tsx
         router.push("/"); // Navigate to new path
         router.refresh(); // Then refresh the page to reflect the latest changes.

         toast.success("Store deleted.")
        }
        catch (error) {
            // This is a safety feature to ensure that users won't just delete all their products.
            // This will be handled in our Prisma database.
            toast.error("Make sure you removed all categories using this billboard first.");
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {/* Only render the delete button if initialData exists. React's conditional rendering. */}
                {initialData && (
                    <Button
                        disabled={loading}
                        variant='destructive'
                        size='default'
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="h-4 w-4" />
                        <p className="pl-1">Delete Store</p>
                    </Button>
                )}

            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField
                        // form.control contains methods for registering components into React Hook Form.
                        // Don't access any of the properties inside the object directly. Only for internal usage.
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                {/* This is for error handling incorrect inputs */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            // form.control contains methods for registering components into React Hook Form.
                            // Don't access any of the properties inside the object directly. Only for internal usage.
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        {/* Disable this input when the form is loading */}
                                        <Input disabled={loading} placeholder="Billboard label" {...field} />
                                    </FormControl>
                                    {/* This is for error handling incorrect inputs */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* The type='submit' will automatically trigger the form.handleSubmit... above */}
                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}