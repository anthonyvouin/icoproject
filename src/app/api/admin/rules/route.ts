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

export async function POST(request: Request) {
  try {
    const { title, content, order } = await request.json();

    // Validation des données
    if (!title || !content || typeof order !== "number") {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Création de la règle
    const rule = await prisma.rule.create({
      data: {
        title,
        content,
        order,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Erreur lors de la création de la règle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la règle" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ruleId = searchParams.get("ruleId");

    if (!ruleId) {
      return NextResponse.json(
        { error: "ID de la règle manquant" },
        { status: 400 }
      );
    }

    await prisma.rule.delete({
      where: { id: parseInt(ruleId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la règle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la règle" },
      { status: 500 }
    );
  }
}
