import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Navigation, navigations } from '../../navigation';
import { NgClass } from '@angular/common';
import Breadcrumb from './breadcrumb';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgClass,
    Breadcrumb
  ],
  templateUrl: './layouts.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class Layouts {
  readonly navs = signal<Navigation[]>(navigations)
}
