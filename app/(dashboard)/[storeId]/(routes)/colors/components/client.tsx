'use client';

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { ColorColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import Heading from "@/components/ui/heading";

interface ColorsClientProps {
  data: ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Colors (${data.length})`}
          description="Manage your Colors"
        />
        <Button
        onClick={() => router.push(`/${params.storeId}/colors/create`)}>
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
        description="API Calls for Colors"
      />
      <Separator className="mt-2" />
      <ApiList 
        entityName="colors"
        entityIdName="colorId"
      />
    </>
  );
};