import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb';

@Component({
  imports: [],
  templateUrl: './students.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Students {
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor(){
    this.#breadcrumb.first(
      {
        name: 'Öğrenciler',
        icon: 'bi-people',
        route: '/students'
      }
    )
  }
}
