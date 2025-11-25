import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import {
  isPublicRoute,
  redirectToOther,
  redirectToSignIn,
  redirectToWelcome,
} from '@/utils/middleware.utils';
import { AuthenticatedNextRequest, UserPath } from '@/types/middleware.types';
import users from '../data/users.json'

const allow_all_users = process.env.AUTH_ALLOW_ANY_USER === "true"

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

export default auth((req: AuthenticatedNextRequest) => {
  try {
    const { nextUrl } = req;
    const isAuthenticated = !!req.auth?.user;
    const isValidPublicRoute = isPublicRoute(nextUrl.pathname);

    if (isValidPublicRoute && isAuthenticated) {
      return redirectToWelcome(nextUrl);
    }

    if (!isAuthenticated && !isValidPublicRoute) {
      return redirectToSignIn(nextUrl);
    }
    
    let userPath: string | undefined = undefined

    // if we don't have a public demo fallback, search the user directory
    if(!allow_all_users) {
      let validUsers : Array<UserPath> = users.emails
      let user = validUsers.find(user => user.email === req.auth?.user.email)
      if(user) { 
        userPath = user.path
        //console.log("Found: ", req.auth?.user)
      }
    } else {
      userPath = "demo"
    }

    // if we have a signed in user than has no path found, redirect them
    if(req.auth?.user && !userPath) {
      if(nextUrl.pathname !== '/nouser') {
        return redirectToOther(req. nextUrl)
      }
    }

    const response = NextResponse.next();
    response.cookies.set("resourcePath", userPath!)

    return response
  } catch (error) {
    console.error('Error in middleware:', error);
    return redirectToSignIn(req.nextUrl);
  }
});
