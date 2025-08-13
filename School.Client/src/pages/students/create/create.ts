import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../../services/breadcrumb';
import { FormsModule, NgForm } from '@angular/forms';
import { initialStudent, Student } from '../../../models/student';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Create {
  readonly data = signal<Student>({...initialStudent});
  readonly file = signal<any | undefined>(undefined);

  readonly #location = inject(Location);
  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #http = inject(HttpClient);

  constructor() {
    this.#breadcrumb.first(
      {
        name: 'Öğrenciler',
        icon: 'bi-people',
        route: '/students'
      }
    );
    this.#breadcrumb.update({
      name: 'Ekle',
      icon: 'bi-plus',
      route: '/students/create'
    });
  }

  cancel() {
    this.#location.back();
  }

  getFile(event:any){
    this.file.set(event.target.files[0]);
  }

  save(form:NgForm){
    if(!form.valid) return;

    if(this.file() === undefined){
      alert("Öğrenci resmi seçmediniz!");
    }

    const formData = new FormData();
    formData.append("firstName", this.data().firstName);
    formData.append("lastName", this.data().lastName);
    formData.append("identityNumber", this.data().identityNumber);
    formData.append("email", this.data().email);
    formData.append("phoneNumber", this.data().phoneNumber);
    formData.append("file",this.file(), this.file().filename);

    this.#http.post("/sc/students", formData).subscribe({
      next: (res) => {
        this.cancel();
      },
      error: (err: HttpErrorResponse) => {
        alert("Bir sorunla karşılaştık");
      }
    })
  }
}
