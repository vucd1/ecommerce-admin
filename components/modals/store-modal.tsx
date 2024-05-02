'use client'

import { z } from 'zod'; // we're using a shadcn form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal"
import { 
    Form, 
    FormControl, 
    FormDescription, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components//ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';


// create a form schema
const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    // define a form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    // define an event handler when users click sumbit
    const onSumbit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        //  TODO: create store
    }

    return (
    <Modal
        title="Create store"
        description="Add a new store to manage products and categories."
        isOpen={storeModal.isOpen}
        onClose={storeModal.onClose}
    >
        <div>
            <div className='space-y-4 py-2 pb-4'>
                {/* build our form */}
                <Form {...form}>
                    {/* An html form element that has an onSumbit event handler which is from
                    react hook form's useForm. They have multiple methods including handleSumbit. */}
                    <form onSubmit={form.handleSubmit(onSumbit)}>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-commerce" {...field} />
                                    </FormControl>
                                    {/* This is to add error messages. Automatic. */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button 
                                variant='outline'
                                onClick={storeModal.onClose}
                            >                                    
                                Cancel
                            </Button>
                            {/* The type='submit' will automatically trigger the form.handleSubmit... above */}
                            <Button type='submit'>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
    );
};