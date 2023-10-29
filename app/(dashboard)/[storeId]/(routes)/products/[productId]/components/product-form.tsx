'use client';
 
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import * as z from 'zod';
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Category, 
  Color, 
  Image, 
  Product, 
  Size 
} from "@prisma/client";

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
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";

import Heading from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  categories: Category[];
  sizes: Size[];
  colors: Color[];

  initialData: Product & {
    images: Image[]
  } | null; 
};

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),

  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),

  price: z.coerce.number().min(1),
  availableQty: z.coerce.number().min(1),

  images: z.object({ url: z.string() }).array()
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData,
  categories,
  sizes,
  colors 
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Product' : 'Create Product';

  const descriptionOfProductPage = initialData
  ? 'Manage your Product Settings'
  : 'Add a new Product to your Store'

  const toastMessage = initialData ? 'Product Updated' : 'Product Created';

  const buttonText = initialData ? 'Update' : 'Create';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
      availableQty: parseFloat(String(initialData?.availableQty))
    } : {
      name: '',
      description: '',
      categoryId: '',
      colorId: '',
      sizeId: '',
      price: 0,
      availableQty: 0,
      images: [],
      isFeatured: false,
      isArchived: false
    }
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/products`);

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
        `/api/${params.storeId}/products/${params.productId}`
      );

      router.refresh();
      router.push(`/${params.storeId}/products`);

      toast.success('Product Deleted!');
    } catch (error) {
      toast.error('Something went wrong!');
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
          description={descriptionOfProductPage}
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
            name='images'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">
                  Images
                </FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    value={field.value.map((image) => image.url)}
                    onChange={(url) => field.onChange([
                      ...field.value, { url }
                    ])}
                    onRemove={(url) => field.onChange([
                      ...field.value.filter((current) => current.url !== url)
                    ])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />          
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
                      placeholder="What is the Name of the Product?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading}
                      placeholder="What is this Product like?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='availableQty'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Available Quantity
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading}
                      type="number"
                      placeholder="How many copies are in Stock?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='price'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Price
                  </FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading}
                      type="number"
                      placeholder="How much is the Product worth? e.g.: 19.99$"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='categoryId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Category
                  </FormLabel>
                  <Select
                  disabled={loading}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a Category"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                        key={category.id}
                        value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>            
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='sizeId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Size
                  </FormLabel>
                  <Select
                  disabled={loading}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a Size"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem
                        key={size.id}
                        value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>            
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='colorId'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">
                    Color
                  </FormLabel>
                  <Select
                  disabled={loading}
                  value={field.value}
                  defaultValue={field.value}
                  onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue 
                          placeholder="Select a Color"
                          defaultValue={field.value}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem
                        key={color.id}
                        value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>            
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              name='isFeatured'
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0
                rounded-lg border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This Product will be displayed in the Home Page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField 
              name='isArchived'
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0
                rounded-lg border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This Product will not appear anywhere in the Store
                    </FormDescription>
                  </div>
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

export default ProductForm;