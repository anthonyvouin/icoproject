import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error("Erreur lors de la récupération des règles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des règles" },
      { status: 500 }
    );
  }
}
