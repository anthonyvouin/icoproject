import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = ["/login", "/register", "/api/login", "/api/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si c'est une route publique
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Vérifier le token JWT dans les cookies
  const token = request.cookies.get("auth_token");

  if (!token) {
    // Rediriger vers la page de connexion si pas de token
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Vérifier la validité du token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key"
    );
    await jwtVerify(token.value, secret);

    return NextResponse.next();
  } catch (error) {
    // Token invalide, rediriger vers la page de connexion
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Configuration des routes à protéger
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (auth routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (inside public directory)
     * 4. /favicon.ico, /sitemap.xml (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
