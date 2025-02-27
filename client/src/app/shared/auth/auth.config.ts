import { HttpContext, HttpContextToken } from '@angular/common/http';

export const AUTH_REDIRECT_PARAM = 'redirect';

export const AUTH_REDIRECT_BYPASS_URL = '/home';

export const BYPASS_AUTHORIZATION = new HttpContextToken(() => false);

export const BYPASS_AUTHORIZATION_CONTEXT = new HttpContext().set(BYPASS_AUTHORIZATION, true);
