import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';


@Component({
  selector: 'page-unit-hc-table-frz',
  templateUrl: 'unit-hc-table-frz.html',
})
export class UnitHcTableFrzPage {
  // 单位信息
  unit: any;
  // 编制信息
  hc: any;
  // 获取单位编制实有人员函数
  hcFrzFunc: any;
  // 编制实有数人员列表
  personList: Array<Object> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.hc = this.navParams.get("hc");
    this.hcFrzFunc = this.navParams.get("hcFrzFunc");
    this.getUnitHcFrz();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitHcTableFrzPage');
  }

  // 获取单位职数的冻结人数详情
  getUnitHcFrz() {
    this.babbUnitProvider[this.hcFrzFunc](this.unit.unitOid,this.hc.hcOid).then(res => {
      this.personList = res;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
