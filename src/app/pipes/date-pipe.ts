import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormatPipe',
})
export class dateFormatPipe implements PipeTransform {
    transform(value: string) {
        let d = new Date(value);
        d.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000);
        var datePipe = new DatePipe("pt-Br");
        value = datePipe.transform(d, 'dd/MM/yyyy');
        return value;
    }
}