import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Student } from '../../models/student';
import { imageMainUrl } from '../../contants';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  templateUrl: './students.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Students {
  //değişkenler
  readonly result = httpResource<Student[]>(() => `/sc/students`);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  readonly imageMainUrl = signal<string>(imageMainUrl);

  //servisler
  readonly #breadcrumb = inject(BreadcrumbService);

  //metotlar
  constructor(){
    this.#breadcrumb.first('Öğrenciler', 'bi-people', '/students')
  }
}
