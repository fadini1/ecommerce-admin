'use client';
 
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import * as z from 'zod';
import axios from "axios";

import { Billboard, Category } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";

import Heading from "@/components/ui/heading";

interface CategoryFormProps {
  initialData: Category | null; 
  billboards: Billboard[]; 
};

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  initialData, 
  billboards 
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Category' : 'Create Category';

  const description = initialData
  ? 'Manage your Category Settings'
  : 'Add a new Category to your Store'

  const toastMessage = initialData ? 'Category Updated' : 'Category Created';

  const buttonText = initialData ? 'Update' : 'Create';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);

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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/categories`);

      toast.success('Category Deleted!');
    } catch (error) {
      toast.error(
        `You must remove all active Products 
        using this Category before proceeding`
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        itemIdentity="Category"
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
                      placeholder="Select a name for your Category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='billboardId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Billboard
                  </FormLabel>
                  <Select
                  disabled={loading}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a Billboard"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem
                        key={billboard.id}
                        value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>            
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

export default CategoryForm;