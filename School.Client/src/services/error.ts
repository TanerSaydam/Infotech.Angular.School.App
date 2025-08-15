import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlexiToastService } from 'flexi-toast';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  readonly #toast = inject(FlexiToastService);

  errorHandler(err: HttpErrorResponse){
    console.log(err);
    let message = "";
    switch (err.status) {
      case 0:
        message = "API adresine ulaşılamıyor";
        break;
      case 400:
        message = "Eksik parametre gönderdiniz";
        break;
      case 401:
        message = "Geçersiz token";
        break;
      case 403:
        message = "Yetkisiz giriş";
        break;
      case 404:
        message = "API adresi bulunamadı";
        break;
      case 500:
        const errorMessages:any[] = err.error.errorMessages;
        errorMessages.forEach(val => {
          message += "<br>" + val
        });
        break;
    }

    this.#toast.showToast("Hata",message,"error");
  }
}
