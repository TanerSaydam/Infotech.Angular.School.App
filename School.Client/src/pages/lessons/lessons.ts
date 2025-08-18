import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, linkedSignal, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { LessonModel, initialLesson } from '../../models/lesson';
import { FlexiGridModule } from 'flexi-grid';
import { BreadcrumbService } from '../../services/breadcrumb';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [FlexiGridModule, FormsModule],
  templateUrl: './lessons.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Lessons {
 readonly result = httpResource<LessonModel[]>(() => '/sc/lessons');
 readonly data = computed(() => this.result.value() ?? []);
 readonly loading = linkedSignal(() => this.result.isLoading());
 readonly addData = signal<LessonModel>({...initialLesson});
 readonly updateData = signal<LessonModel>({...initialLesson});
 readonly addModalCloseBtn = viewChild<ElementRef<HTMLButtonElement>>("addModalCloseBtn");
 readonly updateModalCloseBtn = viewChild<ElementRef<HTMLButtonElement>>("updateModalCloseBtn");

 readonly #breadcrumb = inject(BreadcrumbService);
 readonly #http = inject(HttpService);
 readonly #toast = inject(FlexiToastService);

 constructor(){
  this.#breadcrumb.first("Dersler","bi-card-heading","/class/rooms");
 }

 save(){
  this.#http.post("/sc/lessons", this.addData(),(res => {
    this.#toast.showToast("Başarılı", res.data, "success");
    this.addModalCloseBtn()?.nativeElement.click();
    this.result.reload();
    this.addData.set({...initialLesson});
  }));
 }

 delete(id: string){
  this.#toast.showSwal("Ders Sil?","Dersi silmek istiyor musunuz?","Sil",() => {
    this.loading.set(true);
    this.#http.delete(`/sc/lessons/${id}`,(res) => {
      this.#toast.showToast("Başarılı", res.data, "info");
      this.result.reload();
      this.loading.set(false);
    },() => this.loading.set(false));
  })
 }

 edit(id: string){
  this.updateData.set({id: id, name: ''});
  this.#http.get(`/sc/lessons/${id}`,(res) => {
    this.updateData.set(res);
  });
 }

 update(){
  this.#http.put("/sc/lessons", this.updateData(),(res => {
    this.#toast.showToast("Başarılı", res.data, "info");
    this.updateModalCloseBtn()?.nativeElement.click();
    this.result.reload();
  }));
 }
}
