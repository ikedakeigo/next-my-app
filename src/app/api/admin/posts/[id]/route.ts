import { supabase } from "@/utils/supabase";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// 記事詳細取得API
export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {

  // リクエストのheaderからtokenを取得する
  const token = request.headers.get("Authorization") ?? "";

  //取得したtokenをsupabaseに送り、errorが返ってきたら
  const {error} = await supabase.auth.getUser(token)

  // statusを400とmessageを返却する
  if(error)
    return NextResponse.json({status: error.message}, {status: 400})

  const { id } = params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: "OK",
        post,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
};

// 記事更新API
export const PUT = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  const body = await request.json();
  const { title, content, thumbnailUrl, categories } = body;

  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 記事とカテゴリーの中間テーブルを削除
    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    });

    for (const category of categories) {
      await prisma.postCategory.create({
        data: {
          postId: parseInt(id),
          categoryId: category.id,
        },
      });
    }

    return NextResponse.json(
      {
        status: "OK",
        post,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
};

// 記事削除のAPI
export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;
  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json(
      {
        status: "OK",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          status: error.message,
        },
        {
          status: 400,
        }
      );
    }
  }
};
