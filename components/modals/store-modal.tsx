'use client';

import { useState } from "react";
import { toast } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { zodResolver } from '@hookform/resolvers/zod';
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(1)
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const response = await axios.post('/api/stores', values);

      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Something went terribly wrong :)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Add a new Store to the Database"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="pt-2 pb-6 gap-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name 
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Add a name to your Store"
                        disabled={loading} 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4 gap-2 flex items-center">
                <Button 
                variant='outline' 
                disabled={loading}
                onClick={storeModal.onClose}>
                  Cancel
                </Button>
                <Button 
                type="submit"
                disabled={loading}>
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};