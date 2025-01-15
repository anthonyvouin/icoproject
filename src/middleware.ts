import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  exp?: number;
}

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ["/login", "/register", "/api/login", "/api/register"];

// Routes qui nécessitent le rôle ADMIN
const adminRoutes = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si c'est une route publique, on laisse passer
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Vérifie le token d'authentification
  const token = request.cookies.get("auth_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Vérifie et décode le token
    const { payload } = await jwtVerify(token.value, secret);
    const userPayload = payload as unknown as JWTPayload;

    // Vérifie que le token contient les informations requises
    if (!userPayload.userId || !userPayload.email || !userPayload.role) {
      console.error("Token invalide: informations manquantes");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Vérifie si le token n'est pas expiré
    if (userPayload.exp && userPayload.exp < Math.floor(Date.now() / 1000)) {
      console.error("Token expiré");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Vérifie les permissions pour les routes admin
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      userPayload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Ajoute les informations de l'utilisateur aux headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", userPayload.userId.toString());
    requestHeaders.set("x-user-email", userPayload.email);
    requestHeaders.set("x-user-role", userPayload.role);

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
  matcher: [
    "/profile",
    "/api/profile",
    "/admin/:path*",
    "/api/admin/:path*",
    "/game",
    "/api/game/:path*",
  ],
};
