import { Component, Input } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitFuntionPage } from '../unit-funtion/unit-funtion';
import { HomePage } from '../home/home';
import { UnitHcPage } from '../unit-hc/unit-hc';
import { UnitInterOrgPage } from '../unit-inter-org/unit-inter-org';
import { UnitInterUnitPage } from '../unit-inter-unit/unit-inter-unit';
import { GwSetPage } from '../gw-set/gw-set';
import { ThreeFilePage } from '../three-file/three-file';
import { HistoryFilePage } from '../history-file/history-file';


@Component({
  selector: 'page-unit',
  templateUrl: 'unit.html',
})
export class UnitPage {
  unit: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.getUnit();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitPage');
  }

  getUnit() {
    this.babbUnitProvider.getUnit(this.unit.unitOid).then(res => {
      this.unit = res;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

  // 点击跳到主要职能页面
  onClickUnitFunction() {
    this.navCtrl.push(UnitFuntionPage, {
      unitName: this.unit.unitName,
      unitFunction: this.unit.unitFunction
    });
  }

  // 点击跳到编制职数页面
  onClickUnitHc() {
    this.navCtrl.push(UnitHcPage, { unit: this.unit });
  }

  // 点击跳到内设机构页面
  onClickUnitInterOrg() {
    this.navCtrl.push(UnitInterOrgPage, { unit: this.unit });
  }

  // 点击跳到下设单位页面
  onClickUnitInterUnit() {
    this.navCtrl.push(UnitInterUnitPage, { unit: this.unit, unitKind: 1 });
  }

  // 点击跳到下设事业单位页面
  onClickUnitInterShiYeUnit() {
    this.navCtrl.push(UnitInterUnitPage, { unit: this.unit, unitKind: 3 });
  }

  // 岗位设置表
  onClickUnitGw() {
    this.navCtrl.push(GwSetPage);
  }

  // 三定文件
  onClickThreeFile() {
    this.navCtrl.push(ThreeFilePage);
  }

  // 历史沿革
  onClickHistory() {
    this.navCtrl.push(HistoryFilePage);
  }
}
