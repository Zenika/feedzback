import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreakPipe'
})
export class LineBreakPipePipe implements PipeTransform {

  transform(text: any): any {
    return text.replace(/\n/g,"<br>");
  }

}
