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
    bodyParser: false,
  },
};

// Convertir Request en IncomingMessage
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
  { params }: { params: { id: string } }
) {
  const uploadDir = path.join(process.cwd(), "public", "img");

  const form = new IncomingForm({
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  try {
    const incomingMessage = requestToIncomingMessage(request);

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
    const type = Array.isArray(typeField) ? typeField[0] : typeField;
    const nom = Array.isArray(nomField) ? nomField.join(", ") : nomField;
    const description = Array.isArray(descriptionField) ? descriptionField.join(", ") : descriptionField;
    let imagePath = null;

    console.log("files", files);
    if (files.image) {
      const fileArray = Array.isArray(files.image) ? files.image : [files.image];
      const file = fileArray[0] as formidable.File;
      const newPath = path.join(uploadDir, file.newFilename);
      await fs.rename(file.filepath, newPath);
      imagePath = `/img/${file.newFilename}`;
    }

    const card = await prisma.card.update({
      where: { id: parseInt(params.id) },
      data: {
        nom,
        description,
        type: type as CardType | undefined,
        image: imagePath || undefined,
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