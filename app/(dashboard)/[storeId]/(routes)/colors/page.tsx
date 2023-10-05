import { format } from "date-fns";

import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";

import prismadb from "@/lib/prismadb";

const ColorsPage = async ({ params }: { params: { storeId: string }}) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-6">
        <ColorsClient 
          data={formattedColors}
        />
      </div>
    </div>
  )
}

export default ColorsPage;