import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitFuntionPage } from '../unit-funtion/unit-funtion';

@Component({
  selector: 'page-unit-inter-org',
  templateUrl: 'unit-inter-org.html',
})
export class UnitInterOrgPage {

  // 单位信息
  unit: any;
  // 内设机构列表
  orgList: Array<Object> = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.getUnitInterOrg();
  }

  getUnitInterOrg() {
    this.babbUnitProvider.getUnitInterOrg(this.unit.unitOid).then(res => {
      this.orgList = res;
    });
  }

  // 点击跳到主要职能页面
  onClickUnitFunction(org) {
    this.navCtrl.push(UnitFuntionPage, {
      unitName: org.orgName,
      unitFunction: org.orgFunction,
      type:2
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
