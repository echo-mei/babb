import { Injectable } from '@angular/core';

/*
  Generated class for the BabbHcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BabbHcProvider {

  // 编制排序列表
  hcOrderList = [
    "行政编制", "地税专项编制", "公安专项编制", "检察院专项编制", "法院专项编制", "司法行政专项编制", "劳教专项编制", "监狱专项编制", "森林公安专项编制",
    "政法专项编制", "行政执法专项编制", "行政管理类事业编制", "机关事业编制", "行政事务编制", "事业编制", "高级雇员员额", "专业技术雇员员额", "辅助管理雇员员额",
    "工勤雇员员额", "辅助管理类(老干)雇员", "单列编制", "法定机构员额", "单位自聘人员定额", "临聘人员定额", "编外用人规模", "附属编制"
  ]

  constructor() {
    console.log('Hello BabbHcProvider Provider');
  }

  // 根据指定的顺序对编制进行排序
  sort(attr){
    let newAttr = [];
    // 第一条是总编制
    newAttr.push(attr[0]);
    attr.splice(0,1);
    this.hcOrderList.forEach((item)=>{
      let flag = attr.findIndex((hc)=>{
        return this.trim(hc.hcName) == item;
      });
      if(flag != -1){
        newAttr.push(attr[flag]);
        attr.splice(flag,1);
      }
    });
    attr.forEach((hc)=>{
      newAttr.push(hc);
    })
    return newAttr;
  }

  trim(str){
    return str.replace(/(^\s*) | (\s*$)/g,'');
  }

}
