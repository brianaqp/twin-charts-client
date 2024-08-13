import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tonFormat',
  standalone: true,
})
export class TonFormatPipe implements PipeTransform {
  transform(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
