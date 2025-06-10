import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware(async (auth, req) => {

  console.warn('Middleware triggered for request:', req.cookies.get('access_token')?.value);
  if (!isPublicRoute(req)) {
    // If the user is not authenticated, redirect to the login page

    const accessToken = req.cookies.get('access_token')?.value;
    // const token = accessToken ? await authentication.verifyToken(accessToken) : false;
    if (!accessToken) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
  return NextResponse.next();
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}