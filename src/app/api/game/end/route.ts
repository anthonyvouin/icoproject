import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: "L'ID de la partie est requis" },
        { status: 400 }
      );
    }

    const game = await prisma.game.update({
      where: { id: gameId },
      data: {
        endDate: new Date(),
      },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error("Erreur lors de la fin de la partie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la fin de la partie" },
      { status: 500 }
    );
  }
} 