import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rules = await prisma.game.findMany();

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Erreur lors de la récupération des parties:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des parties" },
      { status: 500 }
    );
  }
}
