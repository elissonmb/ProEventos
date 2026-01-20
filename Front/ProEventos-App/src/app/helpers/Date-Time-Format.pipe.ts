import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ConstantsClass } from '../util/Constants';

@Pipe({
  name: 'DateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return super.transform(value, ConstantsClass.DATE_TIME_FMT);
  }

}
