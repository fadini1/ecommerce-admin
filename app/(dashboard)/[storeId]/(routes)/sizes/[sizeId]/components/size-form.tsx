'use client';
 
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import * as z from 'zod';
import axios from "axios";

import { Size } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
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
import ImageUpload from "@/components/ui/image-upload";

interface SizeFormProps {
  initialData: Size | null;  
};

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
});

type SizeFormValues = z.infer<typeof formSchema>;

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Size' : 'Create Size';

  const description = initialData
  ? 'Manage your Size Settings'
  : 'Add a new Size to your Store'

  const toastMessage = initialData ? 'Size Updated' : 'Size Created';

  const buttonText = initialData ? 'Update' : 'Create';

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  });

  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);

      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something Went Wrong!'); 
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/sizes`);

      toast.success('Size Deleted!');
    } catch (error) {
      toast.error(
        `You must remove all active Products 
        using this Size before proceeding`
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        itemIdentity="Size"
        loading={loading}
        isOpen={open}
        onConfirm={onDelete}
        onClose={() => setOpen(false)}
      />
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description={description}
        />
        {initialData && (
          <Button 
          variant='destructive'
          size='sm'
          disabled={loading}
          onClick={() => setOpen(true)}>
            <Trash className="h-5 w-5" />
          </Button>
        )}
      </div>
      <Separator className="mt-2" />
      <Form {...form}>
        <form 
        className="w-full mt-4"
        onSubmit={form.handleSubmit(onSubmit)}>      
          <div className="grid grid-cols-3 gap-2 mt-3">
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
                      placeholder="What's the Size Name?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
              name='value'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Value
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading}
                      placeholder="What's the Size Value? e.g.: XS"
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
            {buttonText}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;