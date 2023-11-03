import { format } from "date-fns";

import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

import prismadb from "@/lib/prismadb";

const ProductsPage = async ({ params }: { params: { storeId: string }}) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    quantity: item.quantity,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    price: formatter.format(item.price.toNumber()),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 p-6">
        <ProductClient 
          data={formattedProducts}
        />
      </div>
    </div>
  )
}

export default ProductsPage;