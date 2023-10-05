'use client';

import { OrderColumn, columns } from "./columns";

import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";

import Heading from "@/components/ui/heading";

interface OrderClientProps {
  data: OrderColumn[]
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading 
        title={`Orders (${data.length})`}
        description="Manage your Orders"
      />
      <Separator className="mt-2" />
      <DataTable 
        searchKey="products"
        data={data}
        columns={columns}
      />
    </>
  );
};