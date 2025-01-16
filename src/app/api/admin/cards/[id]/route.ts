import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Gestionnaire GET pour récupérer un membre spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const card = await prisma.card.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Carte non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Erreur lors de la récupération de la carte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la carte" },
      { status: 500 }
    );
  }
}

// Gestionnaire PATCH pour mettre à jour une carte
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { nom, description, type } = await request.json();

  try {
    const card = await prisma.card.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        nom,
        description,
        type,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la carte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la carte" },
      { status: 500 }
    );
  }
}