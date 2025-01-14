import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let settings = await prisma.gameSettings.findFirst();

    if (!settings) {
      // Créer les paramètres par défaut s'ils n'existent pas
      settings = await prisma.gameSettings.create({
        data: {
          roundsToWin: 10,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paramètres" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { roundsToWin } = await request.json();

    if (typeof roundsToWin !== "number" || roundsToWin < 1) {
      return NextResponse.json(
        { error: "Le nombre de manches doit être un nombre positif" },
        { status: 400 }
      );
    }

    let settings = await prisma.gameSettings.findFirst();

    if (settings) {
      settings = await prisma.gameSettings.update({
        where: { id: settings.id },
        data: { roundsToWin },
      });
    } else {
      settings = await prisma.gameSettings.create({
        data: { roundsToWin },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour des paramètres" },
      { status: 500 }
    );
  }
}
