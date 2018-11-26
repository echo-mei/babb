import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-unit-funtion',
  templateUrl: 'unit-funtion.html',
})
export class UnitFuntionPage {
  // 单位名称
  unitName: any;
  // 单位职能
  unitFunction: any;
  // 单位类型:1是单位 2是内设机构
  type:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.unitName = this.navParams.get("unitName");
    this.unitFunction = this.navParams.get("unitFunction");
    this.type = this.navParams.get("type");
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
