'use client';
 
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import * as z from 'zod';
import axios from "axios";

import { Store } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { useOrigin } from "@/hooks/use-origin";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ApiAlert } from "@/components/ui/api-alert";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
  Form,
  FormControl,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";

import Heading from "@/components/ui/heading";

interface SettingsFormProps {
  initialData: Store;  
};

const formSchema = z.object({
  name: z.string().min(1)
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);

      await axios.patch(`/api/stores/${params.storeId}`, data);

      router.refresh();

      toast.success('Store Updated!');
    } catch (error) {
      toast.error('Something Went Wrong!'); 
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/stores/${params.storeId}`);

      router.refresh();
      router.push('/');

      toast.success('Store Deleted!');
    } catch (error) {
      toast.error(`You must remove all active Products before proceeding`);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal 
        itemIdentity="Store"
        loading={loading}
        isOpen={open}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center justify-between">
        <Heading 
          title='Settings'
          description='Manage your Store'
        />
        <Button 
        variant='destructive'
        size='sm'
        disabled={loading}
        onClick={() => setOpen(true)}>
          <Trash className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="mt-2" />
      <Form {...form}>
        <form 
        className="w-full mt-4"
        onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-2">
            <FormField 
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading}
                      placeholder="What's the Name of your Store?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
          className="mt-5"
          type='submit'
          disabled={loading}>
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator className="mt-3" />
      <ApiAlert 
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"     
      />
    </>
  );
};

export default SettingsForm;