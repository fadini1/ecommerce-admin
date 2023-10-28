import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET (
  req: Request,
  { params }: { params: { productId: string }}
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product ID Required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export async function PATCH (
  req: Request,
  { params }: { params: { storeId: string, productId: string }}
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      description,
      price,
      images,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived
    } = body;

    if (!userId) {
     return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!name) {
      return new NextResponse('Name Required', { status: 400 });
    }

    if (!description) {
      return new NextResponse('Description Required', { status: 400 });
    }
    
    if (!price) {
      return new NextResponse('Price Required', { status: 400 });
    }
    
    if (!images || !images.length) {
      return new NextResponse('Images Required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category ID Required', { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse('Size ID Required', { status: 400 });
    }

    if (!colorId) {
      return new NextResponse('Color ID Required', { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse('Product ID Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId
      }
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        description,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {}
        }
      }
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image)
            ]
          }
        }
      }
    }); 

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export async function DELETE (
  req: Request,
  { params }: { params: { storeId: string, productId: string }}
) {
  try {
    const { userId } = auth();

    if (!userId) {
     return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse('Product ID Required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId
      }
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
};