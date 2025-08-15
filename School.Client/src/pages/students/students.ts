import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Student } from '../../models/student';
import { imageMainUrl } from '../../contants';
import { RouterLink } from '@angular/router';
import { NgxMaskPipe } from 'ngx-mask';
import { FlexiToastService } from 'flexi-toast';
import { HttpService } from '../../services/http';

@Component({
  imports: [RouterLink, NgxMaskPipe],
  templateUrl: './students.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Students {
  //değişkenler
  readonly result = httpResource<Student[]>(() => `/sc/students`);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = linkedSignal(() => this.result.isLoading());
  readonly imageMainUrl = signal<string>(imageMainUrl);
  readonly loadingList = signal<number[]>([1,2,3,4,5,6,7,8]);

  //servisler
  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);

  //metotlar
  constructor() {
    this.#breadcrumb.first('Öğrenciler', 'bi-people', '/students')
  }

  delete(val: Student) {
    const question = `Öğrenci ${val.firstName} ${val.lastName} silmek istiyor musunuz?`;
    this.#toast.showSwal("Öğrenci Sil?", question, "Sil", () => {
      this.loading.set(true);
      this.#http.delete(`/sc/students/${val.id}`,() => {
        this.result.reload();
        this.loading.set(false);
      },() => this.loading.set(false));
    });
  }
}