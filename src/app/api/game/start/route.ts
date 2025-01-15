import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const game = await prisma.game.create({
      data: {
        startDate: new Date(),
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
