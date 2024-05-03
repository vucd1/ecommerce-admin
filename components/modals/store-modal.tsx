'use client'

import { z } from 'zod'; // we're using a shadcn form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components//ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';


// create a form schema
const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();
    // const axios = require('axios').default; //needed to use axios.<method>

    // declare a loading state variable
    const [ loading, setLoading] = useState(false);
    

    // define a form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
        }
    })

    // define an event handler when users click sumbit
    const onSumbit = async (values: z.infer<typeof formSchema>) => {
        try {
            // set loading to true after clicking the button
            // this will disable the buttons temporarily
            setLoading(true);
            const response = await axios.post('/api/stores', values);
            toast.success('Store created successfully.');
        }
        catch (error) {
            toast.error('Something went wrong.');
        }
        finally {
            // after finishing waiting for the request, set loading to false
            setLoading(false);
        }
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
                                        {/* If page is still loading, disable the button */}
                                        <Input 
                                            disabled={loading} 
                                            placeholder="E-commerce" 
                                            {...field} 
                                        />
                                    </FormControl>
                                    {/* This is to add error messages. Automatic. */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button 
                                disabled={loading} 
                                variant='outline'
                                onClick={storeModal.onClose}
                            >                                    
                                Cancel
                            </Button>
                            {/* The type='submit' will automatically trigger the form.handleSubmit... above */}
                            <Button 
                                disabled={loading} 
                                type='submit'
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    </Modal>
    );
};