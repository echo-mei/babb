import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitPage } from '../unit/unit';

@Component({
  selector: 'page-unit-inter-unit',
  templateUrl: 'unit-inter-unit.html',
})
export class UnitInterUnitPage {

  // 单位信息
  unit: any;
  // 单位类型
  unitKind:any;
  // 下设机构列表
  unitList: Array<Object> = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.unitKind = this.navParams.get("unitKind");
    this.getUnitInterUnit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitInterUnitPage');
  }

  getUnitInterUnit() {
    if (this.unitKind == 3) {
      // 下属事业单位
      this.babbUnitProvider.getUnitInterInstitution(this.unit.unitOid).then(res => {
        this.unitList = res;
      });
    } else {
      // 下属参公、机关单位
      this.babbUnitProvider.getUnitInterUnit(this.unit.unitOid).then(res => {
        this.unitList = res;
      });
    }
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  // 点击单位跳转单位详情页
  onClickUnit(unit){
    this.navCtrl.push(UnitPage,{
      unit:unit
    })
  }
}
