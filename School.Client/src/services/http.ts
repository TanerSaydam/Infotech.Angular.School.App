import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ErrorService } from './error';
import { SKIP_ERROR_INTERCEPTOR } from '../interceptors/error-interceptor';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  readonly #http = inject(HttpClient);
  readonly #error = inject(ErrorService);

  get(endpoint: string, callBack: (val:any) => void, errorCallBack?: (err:HttpErrorResponse) => void) {
    const http = this.#http.get(endpoint, {
      context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true)
    })
    this.request(http, callBack, errorCallBack);
  }

  post(endpoint: string, body:any, callBack: (val:any) => void, errorCallBack?: (err:HttpErrorResponse) => void) {
    const http = this.#http.post(endpoint, body, {
      context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true)
    })
    this.request(http, callBack, errorCallBack);
  }

  put(endpoint: string, body:any, callBack: (val:any) => void, errorCallBack?: (err:HttpErrorResponse) => void) {
    const http = this.#http.put(endpoint, body, {
      context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true)
    })
    this.request(http, callBack, errorCallBack);
  }

  delete(endpoint: string, callBack: (val:any) => void, errorCallBack?: (err:HttpErrorResponse) => void) {
    const http = this.#http.delete(endpoint, {
      context: new HttpContext().set(SKIP_ERROR_INTERCEPTOR, true)
    });
    this.request(http, callBack, errorCallBack);
  }

  request(http: any, callBack: (val:any) => void, errorCallBack?: (err:HttpErrorResponse) => void){
    http.subscribe({
      next: (res:any) => callBack(res),
      error: (err: HttpErrorResponse) => {
        this.#error.errorHandler(err);
        if(errorCallBack){
          errorCallBack(err);
        }
      }
    });
  }
}
