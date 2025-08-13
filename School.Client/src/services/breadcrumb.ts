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

  update(name: string, icon: string, route: string){
    const nav: Navigation = {
      name: name,
      icon: icon,
      route: route
    }
    this.navs.update(prev => [...prev, nav]);
  }

  first(name: string, icon: string, route: string){
    this.reset();
    this.update(name, icon, route);
  }
}
