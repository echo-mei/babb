import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';


@Component({
  selector: 'page-unit-hc-table-infact',
  templateUrl: 'unit-hc-table-infact.html',
})
export class UnitHcTableInfactPage {
  // 单位信息
  unit: any;
  // 编制信息
  hc: any;
  // 获取单位编制实有人员函数
  hcInfactFunc: any;
  // 编制实有数人员列表
  personList: Array<Object> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.hc = this.navParams.get("hc");
    this.hcInfactFunc = this.navParams.get("hcInfactFunc");
    console.log(this.hcInfactFunc)
    this.getUnitHcInfact();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitHcTableDetailPage');
  }

  // 获取单位职数的实有人数详情
  getUnitHcInfact() {
    this.babbUnitProvider[this.hcInfactFunc](this.unit.unitOid,this.hc.hcOid).then(res => {
      this.personList = res;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
