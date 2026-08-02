import { NextRequest, NextResponse } from "next/server";

// Route yang tidak memerlukan autentikasi
const PUBLIC_PATHS = ["/login", "/register", "/_next", "/favicon.ico", "/api"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Izinkan akses ke public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Cek apakah user sudah login via Firebase session
  // Firebase client-side auth tidak punya server-side cookie bawaan,
  // jadi kita cek custom cookie yang akan di-set oleh LoginPage
  const authToken = request.cookies.get("auth_token");

  if (!authToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match semua request kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
