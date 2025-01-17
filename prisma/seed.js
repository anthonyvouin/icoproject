"prisma/seed.js"

import bcrypt from "bcryptjs";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function initDB() {
  const hashedPassword = await bcrypt.hash("skurtis", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "skurtis@yopmail.com",
      name: "skurtis",
      password: hashedPassword, 
      role: "ADMIN",
    },
  });

  const cards = await prisma.card.createMany({
    data: [
      {
        nom: "pirate",
        description: "Description for card 1",
        type: "ROLE",
        image: `/img/pirate_illu.png`
      },
      {
        nom: "marin",
        description: "Description for card 2",
        type: "ROLE",
        image: `/img/marin-illu.png`
      },
      {
        nom: "sirene",
        description: "Description for card 3",
        type: "ROLE",
        image: `/img/sirene_illu.png`
      },

      {
        nom: "ile",
        description: "Permet d’arriver à destination. S’il y a trois îles, la manche est gagnée pour les marins et la sirène",
        type: "ACTION",
        image: `/img/ile-illu.png`
      },
      {
        nom: "poison",
        description: "L’équipage est empoisonné par les pirates",
        type: "ACTION",
        image: `/img/poison_illu.png`
      },

      {
        nom: "Antidote",
        description: "Si une carte poison est trouvée, l’antidote permet de sauver l’équipage, le point pour les pirates est donc annulé, mais aucun point n’est gagné pour les marins.",
        type: "BONUS",
        image: `/img/antidote_illu.png`
      },
    ],
  });
}

initDB();

