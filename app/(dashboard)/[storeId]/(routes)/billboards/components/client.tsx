'use client';

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { BillboardColumn, columns } from "./columns";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";

import Heading from "@/components/ui/heading";

interface BillboardClientProps {
  data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={`Billboards (${data.length})`}
          description="Manage your Billboards"
        />
        <Button
        onClick={() => router.push(`/${params.storeId}/billboards/create`)}>
          <Plus className="mr-2 -ml-1 w-4 h-4" />
          Add
        </Button>
      </div>
      <Separator className="mt-2" />
      <DataTable 
        searchKey="label"
        data={data}
        columns={columns}
      />
      <Heading 
        title="API"
        description="API Calls for Billboards"
      />
      <Separator className="mt-2" />
      <ApiList 
        entityName="billboards"
        entityIdName="billboardId"
      />
    </>
  );
};