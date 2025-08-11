import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'breadcrumb',
  imports: [NgClass, RouterLink],
  template: `
  <ol class="breadcrumb mb-0">
    @for(nav of breadcrumb.navs(); track nav.route){
      <li class="breadcrumb-item" [class.active]="$last" aria-current="page">
        <div class="d-flex gap-1 align-items-center">
          <i class="bi" [ngClass]="nav.icon"></i>
          <a [routerLink]="nav.route">{{nav.name}}</a>
        </div>
      </li>
    }
  </ol>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Breadcrumb {
  readonly breadcrumb = inject(BreadcrumbService);
}
