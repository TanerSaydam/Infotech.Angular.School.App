import { Injectable, signal } from '@angular/core';
import { Navigation } from '../navigation';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  readonly navs = signal<Navigation[]>([]);

  reset(){
    this.navs.set([
      {
        name: 'Ana Sayfa',
        route: '/',
        icon: 'bi-house-fill'
      }
    ]);
  }

  update(nav: Navigation){
    this.navs.update(prev => [...prev, nav]);
  }

  first(nav: Navigation){
    this.reset();
    this.update(nav);
  }
}
