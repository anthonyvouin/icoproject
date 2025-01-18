import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction PUT pour mettre à jour un contact
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    // Assurez-vous d'attendre l'accès à `context.params`
    const params = await context.params;
    const id = params?.id; // Récupère l'ID du message

    if (!id) {
      return NextResponse.json(
        { error: "ID non fourni" },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    // Vérifiez que le statut est valide
    if (!status || (status !== "READ" && status !== "PENDING")) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // Mise à jour dans la base de données
    const updatedContact = await prisma.contact.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
