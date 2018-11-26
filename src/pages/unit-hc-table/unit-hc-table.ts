import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitHcTableInfactPage } from '../unit-hc-table-infact/unit-hc-table-infact';
import { UnitHcTableFrzPage } from '../unit-hc-table-frz/unit-hc-table-frz';


@Component({
  selector: 'page-unit-hc-table',
  templateUrl: 'unit-hc-table.html',
})
export class UnitHcTablePage {

  // 单位信息
  unit: any;
  // 获取单位编制函数
  hcFunc: any;
  // 获取单位职数函数
  leaderFunc: any;
  // 获取单位编制实有数具体人员函数
  hcInfactFunc: any;
  // 获取单位编制冻结数具体人员函数
  hcFrzFunc: any;
  // 编制列表
  hcList: Array<Object> = [];
  // 职数列表
  leaderList: Array<Object> = [];
  aviodSuperHcFlag = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider,
  public appCtrl:App) {
    this.unit = this.navParams.get("unit");
    this.hcFunc = this.navParams.get("hcFunc");
    this.leaderFunc = this.navParams.get("leaderFunc");
    this.hcInfactFunc = this.navParams.get("hcInfactFunc");
    this.hcFrzFunc = this.navParams.get("hcFrzFunc");
    this.getUnitHc();
    this.getUnitLeader();
  }

  // 获取单位的编制
  getUnitHc() {
    this.babbUnitProvider[this.hcFunc](this.unit.unitOid).then(res => {
      this.hcList = res;
    });
  }

  // 获取单位的职数
  getUnitLeader() {
    this.babbUnitProvider[this.leaderFunc](this.unit.unitOid).then(res => {
      this.leaderList = res;
    });
  }

  // 获取单位领导职数、内下设领导职数各多少个，总共在页面占几列
  getCol(str) {
    let attr = this.leaderList.filter(item => item["dutyAttributeName"] == str && item["dutyLevelName"] != "总职数");
    return attr.length;
  }

  // 点击实有数详情
  onClickInfact(hc) {
    this.appCtrl.getRootNav().push(UnitHcTableInfactPage, {
      unit: this.unit,
      hc: hc,
      hcInfactFunc: this.hcInfactFunc
    })
  }

  // 点击冻结数详情
  onClickFrz(hc) {
    this.appCtrl.getRootNav().push(UnitHcTableFrzPage, {
      unit: this.unit,
      hc: hc,
      hcFrzFunc: this.hcFrzFunc
    })
  }

  aviodSuperJudge(wrap){
    return (wrap.clientWidth < wrap.scrollWidth)?(wrap.clientWidth < wrap.scrollWidth):null;
  }
}
