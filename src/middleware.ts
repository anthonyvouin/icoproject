import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

interface JWTCustomPayload extends JWTPayload {
  userId: string;
  email: string;
}

const publicRoutes = ["/login", "/register", "/api/login", "/api/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );

    const { payload } = await jwtVerify(token.value, secret);
    const userPayload = payload as JWTCustomPayload;

    // Vérifications supplémentaires
    if (!userPayload.userId || !userPayload.email) {
      throw new Error("Token invalide: informations manquantes");
    }

    // Vérifier si le token n'est pas expiré (en plus de la vérification automatique de jwtVerify)
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTimestamp) {
      throw new Error("Token expiré");
    }

    // Optionnel: Ajouter les informations de l'utilisateur aux headers
    // pour les rendre disponibles dans vos routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", userPayload.userId);
    requestHeaders.set("x-user-email", userPayload.email);

    // Continuer avec les headers modifiés
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Erreur de vérification du token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
