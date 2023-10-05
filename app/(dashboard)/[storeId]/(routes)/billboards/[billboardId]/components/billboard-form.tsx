'use client';
 
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import * as z from 'zod';
import axios from "axios";

import { Billboard } from "@prisma/client";
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

interface BillboardFormProps {
  initialData: Billboard | null;  
};

const formSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1)
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Billboard' : 'Create Billboard';

  const description = initialData
  ? 'Manage your Billboard Settings'
  : 'Add a new Billboard to your Store'

  const toastMessage = initialData ? 'Billboard Updated' : 'Billboard Created';

  const buttonText = initialData ? 'Update' : 'Create';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);

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
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/billboards`);

      toast.success('Billboard Deleted!');
    } catch (error) {
      toast.error(
        `You must remove all active Categories 
        using this Billboard before proceeding`
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        itemIdentity="Billboard"
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
          <FormField 
            name='imageUrl'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">
                  Background Image
                </FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <FormField 
              name='label'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Label
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading}
                      placeholder="What's the Label of the Billboard?"
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

export default BillboardForm;