import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const game = await prisma.game.create({
      data: {
        startDate: new Date(),
        user_id: 0,
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

// Mettre à jour la date de fin d'une partie
export async function PUT(request: Request) {
  try {
    const { gameId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { error: "ID de la partie manquant" },
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
    console.error("Erreur lors de la mise à jour de la partie:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la partie" },
      { status: 500 }
    );
  }
}
