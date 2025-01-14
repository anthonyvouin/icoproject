import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.gameSettings.findFirst();
    return NextResponse.json({ timer: settings?.timer ?? 10 });
  } catch (error) {
    console.error("Erreur lors de la récupération du timer:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du timer" },
      { status: 500 }
    );
  }
}
