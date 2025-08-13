import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace("/sc/","https://localhost:7152/");
  const clone = req.clone({
    url: url
  });
  return next(clone);
};