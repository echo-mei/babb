import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HighLightPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'highLight',
})
export class HighLightPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, keyword: string) {
    //正则替换
    //g （全文查找出现的所有 pattern）
    if (keyword) {
      // 特殊字符匹配
      let pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]", "g")
      keyword = keyword.replace(pattern, "\\$&");
      let hlValue = new RegExp('['+keyword.trim().split('')+']', "g");
      // let hlValue = new RegExp('['+keyword.trim().split('')+']');
      value = value.replace(hlValue, "<font class='highlight'>$&</font>");
    }
    return value;
  }
}
