import { Component, Input, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitHcTablePage } from '../unit-hc-table/unit-hc-table';



@Component({
  selector: 'page-unit-hc',
  templateUrl: 'unit-hc.html',
})
export class UnitHcPage {
  @ViewChild('mySlider') slides: Slides;

  unit: any;
  // 本单位编制职数列表
  hcList: Array<Object> = [];
  // 本单位及其下设单位编制职数列表
  hcAllList: Array<Object> = [];
  // 本单位下设单位的统计数量
  childCount = 0;
  // tab选中项的标志
  tabIndex = 0;
  page1: any = UnitHcTablePage;
  page2: any = UnitHcTablePage;
  page1Params = {};
  page2Params = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.getChildUnit();
    this.page1Params = {
      unit: this.unit,
      hcFunc: "getUnitHc",
      leaderFunc: "getUnitLeader",
      hcInfactFunc: "getUnitHcInfact",
      hcFrzFunc: "getUnitHcFrz"
    }
    this.page2Params = {
      unit: this.unit,
      hcFunc: "getUnitHcAll",
      leaderFunc: "getUnitLeaderAll",
      hcInfactFunc: "getUnitHcInfactAll",
      hcFrzFunc: "getUnitHcFrzAll"
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitHcPage');
  }

  getChildUnit() {
    this.babbUnitProvider.getChildUnit(this.unit.unitOid).then(res => {
      this.childCount = res.count;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
