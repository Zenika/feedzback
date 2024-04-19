import { HttpContextToken } from '@angular/common/http';

export const BYPASS_LOADING = new HttpContextToken(() => false);
