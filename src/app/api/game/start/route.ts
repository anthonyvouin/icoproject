import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const game = await prisma.game.create({
      data: {
        startDate: new Date(),
        user_id: parseInt(userId),
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Erreur lors de la création de la partie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la partie" },
      { status: 500 }
    );
  }
}
