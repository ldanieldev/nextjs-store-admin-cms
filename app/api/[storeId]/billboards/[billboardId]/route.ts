import { deleteCloudImage } from '@/lib/cloudinary';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!label) {
      return new NextResponse('Label is required', { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse('Image url is required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const userStore = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!userStore) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const currentBillboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId
      }
    });

    if (currentBillboard?.imageUrl) deleteCloudImage(currentBillboard.imageUrl);

    const billboard = await prismadb.billboard.updateMany({
      where: { id: params.billboardId },
      data: { label, imageUrl }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_PATCH_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const userStore = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!userStore) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId
      }
    });

    if (billboard?.imageUrl) deleteCloudImage(billboard.imageUrl);

    const deleteResp = await prismadb.billboard.deleteMany({
      where: { id: params.billboardId }
    });

    return NextResponse.json(deleteResp);
  } catch (error) {
    console.log('[BILLBOARD_DELETE_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
