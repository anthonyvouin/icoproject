import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des cartes" },
      { status: 500 }
    );
  }
}