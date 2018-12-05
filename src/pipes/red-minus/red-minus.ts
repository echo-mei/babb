import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'redMinus',
})
export class RedMinusPipe implements PipeTransform {
  transform(value: any) {
    if (value && value < 0) {
      value = `<font class="red-minus">${value}</font>`;
    }
    return value;
  }
}
