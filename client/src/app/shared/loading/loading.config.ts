import { HttpContext, HttpContextToken } from '@angular/common/http';

export const BYPASS_LOADING = new HttpContextToken(() => false);

export const BYPASS_LOADING_CONTEXT = new HttpContext().set(BYPASS_LOADING, true);
