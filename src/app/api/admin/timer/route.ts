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

export async function PUT(request: Request) {
  try {
    const { timer } = await request.json();

    if (typeof timer !== "number" || timer < 1) {
      return NextResponse.json(
        { error: "Le timer doit être un nombre positif" },
        { status: 400 }
      );
    }

    const settings = await prisma.gameSettings.findFirst();

    if (settings) {
      const updatedSettings = await prisma.gameSettings.update({
        where: { id: settings.id },
        data: { timer },
      });
      return NextResponse.json({ timer: updatedSettings.timer });
    } else {
      const newSettings = await prisma.gameSettings.create({
        data: { timer },
      });
      return NextResponse.json({ timer: newSettings.timer });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du timer:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du timer" },
      { status: 500 }
    );
  }
}
