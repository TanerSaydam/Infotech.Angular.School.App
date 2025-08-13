import { Location, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../../services/breadcrumb';
import { FormsModule, NgForm } from '@angular/forms';
import { initialStudent, Student } from '../../../models/student';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  imports: [FormsModule, NgClass],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      var res = await lastValueFrom(this.#http.get<Student>(`/sc/students/${this.id()}`));
      this.#breadcrumb.update(`${res.firstName} ${res.lastName}`,'bi-pen', `/students/edit/${res.id}`);
      return res;
    }
  });
  readonly data = computed<Student>(() => this.result.value() ?? {...initialStudent});
  readonly loading = computed(() => this.result.isLoading());
  readonly file = signal<any | undefined>(undefined);
  readonly cardIcon = computed(() => this.id() ? 'bi-pen' : 'bi-plus');
  readonly cardTitle = computed(() => this.id() ? 'Öğrenci Güncelleme Formu' : 'Öğrenci Ekleme Formu');
  readonly btnIcon = computed(() => this.id() ? 'bi-pen' : 'bi-plus-square');
  readonly btnName = computed(() => this.id() ? 'Güncelle' : 'Kaydet');

  readonly #location = inject(Location);
  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #http = inject(HttpClient);
  readonly #activated = inject(ActivatedRoute);

  constructor() {
    this.#breadcrumb.first('Öğrenciler', 'bi-people', '/students')

    this.#activated.params.subscribe(res => {
      if(res['id']){
        this.id.set(res['id']);
      }else{
        this.#breadcrumb.update('Ekle', 'bi-plus', '/students/create');
      }
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

    if(!this.file() && !this.id()){
      alert("Öğrenci resmi seçmediniz!");
    }

    const formData = new FormData();
    if(this.id()){
      formData.append("id", this.id()!);
    }
    formData.append("firstName", this.data().firstName);
    formData.append("lastName", this.data().lastName);
    formData.append("identityNumber", this.data().identityNumber);
    formData.append("email", this.data().email);
    formData.append("phoneNumber", this.data().phoneNumber);
    if(this.file()){
      formData.append("file",this.file(), this.file().filename);
    }

    const endpoint = "/sc/students";
    const http = this.id() ? this.#http.put(endpoint, formData) : this.#http.post(endpoint, formData);

    http.subscribe({
      next: (res) => {
        this.cancel();
      },
      error: (err: HttpErrorResponse) => {
        alert("Bir sorunla karşılaştık");
      }
    });
  }
}
