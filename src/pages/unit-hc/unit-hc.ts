import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitHcTablePage } from '../unit-hc-table/unit-hc-table';
import { UnitPosTablePage } from '../unit-pos-table/unit-pos-table';



@Component({
  selector: 'page-unit-hc',
  templateUrl: 'unit-hc.html',
})
export class UnitHcPage {
  unit: any;
  // 本单位编制职数列表
  hcList: Array<Object> = [];
  // 本单位及其下设单位编制职数列表
  hcAllList: Array<Object> = [];
  // 本单位下设单位
  childUnits: Array<Object> = [];
  // tab选中项的标志
  tabIndex = 0;
  page1: any = UnitHcTablePage;
  page2: any = UnitPosTablePage;
  // 本单位及下设单位编制统计函数参数
  page11Params = {};
  // 本单位及下设单位职数统计函数参数
  page12Params = {};
  // 本单位编制统计函数参数
  page21Params = {};
  // 本单位职数统计函数参数
  page22Params = {};
  // 下设单位编制统计函数参数
  page31Params = {};
  // 下设单位职数统计函数参数
  page32Params = {};
  // 医院编制统计函数参数
  page41Params = {};
  // 医院职数统计函数参数
  page42Params = {};
  // 学校编制统计函数参数
  page51Params = {};
  // 学校职数统计函数参数
  page52Params = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider) {
    this.unit = this.navParams.get("unit");
    this.getChildUnit();
    this.page11Params = {
      unit: this.unit,
      name:"本单位及下设机构",
      hcFunc: "getUnitHcAll",
      hcInfactFunc: "getUnitHcInfactAll",
      hcFrzFunc: "getUnitHcFrzAll"
    }
    this.page12Params = {
      unit: this.unit,
      name:"本单位及下设机构",
      leaderFunc: "getUnitLeaderAll",
      leaderInfactFunc: "getUnitLeaderInfactAll"
    }
    this.page21Params = {
      unit: this.unit,
      name:"本单位",
      hcFunc: "getUnitHc",
      hcInfactFunc: "getUnitHcInfact",
      hcFrzFunc: "getUnitHcFrz"
    }
    this.page22Params = {
      unit: this.unit,
      name:"本单位",
      leaderFunc: "getUnitLeader",
      leaderInfactFunc: "getUnitLeaderInfact"
    }
    this.page31Params = {
      unit: this.unit,
      name:"下设机构",
      hcFunc: "getUnitHcInter",
      hcInfactFunc: "getUnitHcInfactInter",
      hcFrzFunc: "getUnitHcFrzInter"
    }
    this.page32Params = {
      unit: this.unit,
      name:"下设机构",
      leaderFunc: "getUnitLeaderInter",
      leaderInfactFunc: "getUnitLeaderInfactInter"
    }
    this.page41Params = {
      unit: this.unit,
      name:"医院",
      hcFunc: "getUnitHcHos",
      hcInfactFunc: "getUnitHcInfactHos",
      hcFrzFunc: "getUnitHcFrzHos"
    }
    this.page42Params = {
      unit: this.unit,
      name:"医院",
      leaderFunc: "getUnitLeaderHos",
      leaderInfactFunc: "getUnitLeaderInfactHos"
    }
    this.page51Params = {
      unit: this.unit,
      name:"学校",
      hcFunc: "getUnitHcEdu",
      hcInfactFunc: "getUnitHcInfactEdu",
      hcFrzFunc: "getUnitHcFrzEdu"
    }
    this.page52Params = {
      unit: this.unit,
      name:"学校",
      leaderFunc: "getUnitLeaderEdu",
      leaderInfactFunc: "getUnitLeaderInfactEdu"
    }
  }

  getChildUnit() {
    this.babbUnitProvider.getChildUnit(this.unit.unitOid).then(res => {
      this.childUnits = res;
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
