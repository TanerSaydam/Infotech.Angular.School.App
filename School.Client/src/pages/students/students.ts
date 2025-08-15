import { ChangeDetectionStrategy, Component, computed, effect, inject, linkedSignal, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Student } from '../../models/student';
import { imageMainUrl } from '../../contants';
import { RouterLink } from '@angular/router';
import { NgxMaskPipe } from 'ngx-mask';
import { FlexiToastService } from 'flexi-toast';
import { HttpService } from '../../services/http';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  imports: [RouterLink, NgxMaskPipe, InfiniteScrollDirective],
  templateUrl: './students.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Students {
  //değişkenler
  readonly pageNumber = signal<number>(1);
  readonly pageSize = signal<number>(23);
  readonly result = httpResource<Student[]>(() => `/sc/students?pageNumber=${this.pageNumber()}&pageSize=${this.pageSize()}`);
  readonly orjData = computed(() => this.result.value() ?? []);
  readonly data = signal<Student[]>([]);
  readonly loading = linkedSignal(() => this.result.isLoading());
  readonly imageMainUrl = signal<string>(imageMainUrl);
  readonly loadingList = signal<number[]>([1,2,3,4,5,6,7,8]);

  //servisler
  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);

  //metotlar
  constructor() {
    this.#breadcrumb.first('Öğrenciler', 'bi-people', '/students');

    effect(() => {
      if(this.orjData().length > 0){
        this.data.update(prev => [...prev, ...this.orjData()]);
      }
    })
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

   onScroll() {
    this.pageNumber.update(prev => prev + 1);
  }
}