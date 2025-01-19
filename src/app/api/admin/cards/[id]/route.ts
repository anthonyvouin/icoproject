import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import formidable, { IncomingForm } from "formidable";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { CardType } from "../../../../game/types";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Désactiver le bodyParser pour permettre l'upload de fichiers
  },
};

// Convertir une requête Request en IncomingMessage
function requestToIncomingMessage(request: Request): IncomingMessage {
  const { body, headers } = request;

  const readable = new Readable({
    read() {},
  });

  (readable as any).headers = Object.fromEntries(headers.entries());
  body?.pipeTo(
    new WritableStream({
      write(chunk) {
        readable.push(chunk);
      },
      close() {
        readable.push(null);
      },
    })
  );

  return readable as unknown as IncomingMessage;
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const uploadDir = path.join(process.cwd(), "public", "img");

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  try {
    // Attendre explicitement que params.id soit prêt
    const params = await context.params;

    // Validation de l'ID
    if (!params?.id) {
      return NextResponse.json(
        { error: "ID de carte manquant" },
        { status: 400 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de carte invalide" },
        { status: 400 }
      );
    }

    const incomingMessage = requestToIncomingMessage(request);

    // Parser les données de la requête
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(incomingMessage, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { nom: nomField, description: descriptionField, type: typeField } = fields;
    const nom = Array.isArray(nomField) ? nomField.join(", ") : nomField;
    const description = Array.isArray(descriptionField)
      ? descriptionField.join(", ")
      : descriptionField;
    const type = Array.isArray(typeField) ? typeField[0] : typeField;

    let imagePath = null;

    // Gestion des fichiers
    if (files.image) {
      const fileArray = Array.isArray(files.image) ? files.image : [files.image];
      const file = fileArray[0] as formidable.File;
      const newPath = path.join(uploadDir, file.newFilename);
      await fs.rename(file.filepath, newPath);
      imagePath = `/img/${file.newFilename}`;
    }

    // Mise à jour dans la base de données
    const card = await prisma.card.update({
      where: { id },
      data: {
        nom,
        description,
        type: type as CardType | undefined,
        image: imagePath || undefined,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la carte :", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la carte" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Attendre explicitement que params.id soit prêt
    const params = await context.params;

    // Validation de l'ID
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID de carte invalide" },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json(
        { error: "Carte non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Erreur lors de la récupération de la carte :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la carte" },
      { status: 500 }
    );
  }
}
