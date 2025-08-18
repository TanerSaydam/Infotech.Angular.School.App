import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, linkedSignal, signal, viewChild, ViewEncapsulation } from '@angular/core';
import { ClassRoomModel, initialClassRoom } from '../../models/class-room';
import { FlexiGridModule } from 'flexi-grid';
import { BreadcrumbService } from '../../services/breadcrumb';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [FlexiGridModule, FormsModule],
  templateUrl: './class-rooms.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ClassRooms {
 readonly result = httpResource<ClassRoomModel[]>(() => '/sc/class-rooms');
 readonly data = computed(() => this.result.value() ?? []);
 readonly loading = linkedSignal(() => this.result.isLoading());
 readonly addData = signal<ClassRoomModel>({...initialClassRoom});
 readonly updateData = signal<ClassRoomModel>({...initialClassRoom});
 readonly addModalCloseBtn = viewChild<ElementRef<HTMLButtonElement>>("addModalCloseBtn");
 readonly updateModalCloseBtn = viewChild<ElementRef<HTMLButtonElement>>("updateModalCloseBtn");

 readonly #breadcrumb = inject(BreadcrumbService);
 readonly #http = inject(HttpService);
 readonly #toast = inject(FlexiToastService);

 constructor(){
  this.#breadcrumb.first("Sınıflar","bi-buildings","/class/rooms");
 }

 save(){
  this.#http.post("/sc/class-rooms", this.addData(),(res => {
    this.#toast.showToast("Başarılı", res.data, "success");
    this.addModalCloseBtn()?.nativeElement.click();
    this.result.reload();
    this.addData.set({...initialClassRoom});
  }));
 }

 delete(id: string){
  this.#toast.showSwal("Sınıf Sil?","Sınıfı silmek istiyor musunuz?","Sil",() => {
    this.loading.set(true);
    this.#http.delete(`/sc/class-rooms/${id}`,(res) => {
      this.#toast.showToast("Başarılı", res.data, "info");
      this.result.reload();
      this.loading.set(false);
    },() => this.loading.set(false));
  })
 }

 edit(id: string){
  this.updateData.set({id: id, name: ''});
  this.#http.get(`/sc/class-rooms/${id}`,(res) => {
    this.updateData.set(res);
  });
 }

 update(){
  this.#http.put("/sc/class-rooms", this.updateData(),(res => {
    this.#toast.showToast("Başarılı", res.data, "info");
    this.updateModalCloseBtn()?.nativeElement.click();
    this.result.reload();
  }));
 }
}
