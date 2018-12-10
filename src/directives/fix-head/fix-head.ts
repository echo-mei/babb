import { Directive, ElementRef } from '@angular/core';

/**
 * Generated class for the FixHeadDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[fix-head]' // Attribute selector
})
export class FixHeadDirective {

  constructor(private el:ElementRef) {
    console.log(this.el.nativeElement,
      this.el.nativeElement.clientWidth,
      this.el.nativeElement.clientHeight,
      this.el.nativeElement.scrollWidth,
      this.el.nativeElement.scrollHeight);
  }



}
