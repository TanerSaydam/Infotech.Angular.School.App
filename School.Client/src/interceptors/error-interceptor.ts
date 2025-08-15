import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ErrorService } from '../services/error';
import { HttpContextToken } from '@angular/common/http';

export const SKIP_ERROR_INTERCEPTOR = new HttpContextToken<boolean>(() => false);


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_ERROR_INTERCEPTOR)) {
    return next(req); // bu istek için interceptor kapalı
  }

  const errorService = inject(ErrorService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      errorService.errorHandler(err);
      return of();
    })
  );
};
