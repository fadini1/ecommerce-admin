'use client';

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ProductColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import Heading from "@/components/ui/heading";

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Products (${data.length})`}
          description="Manage your Products"
        />
        <Button
        onClick={() => router.push(`/${params.storeId}/products/create`)}>
          <Plus className="mr-2 -ml-1 w-4 h-4" />
          Add
        </Button>
      </div>
      <Separator className="mt-2" />
      <DataTable 
        searchKey="name"
        data={data}
        columns={columns}
      />
      <Heading 
        title="API"
        description="API Calls for Products"
      />
      <Separator className="mt-2" />
      <ApiList 
        entityName="products"
        entityIdName="productId"
      />
    </>
  );
};