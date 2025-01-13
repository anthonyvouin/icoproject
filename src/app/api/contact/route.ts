import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { type, message, email } = await request.json();

    if (!type || !message || !email) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    // Création du ticket
    const contact = await prisma.contact.create({
      data: {
        type,
        message,
        email,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du ticket" },
      { status: 500 }
    );
  }
}
