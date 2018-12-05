import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UnitDisTablePage } from "../unit-dis-table/unit-dis-table";
import { BabbDisProvider} from "../../providers/babb-dis/babb-dis";
import { UnitDisPersonTablePage } from '../unit-dis-person-table/unit-dis-person-table';
import { UnitDisJgLeaderTablePage } from '../unit-dis-jg-leader-table/unit-dis-jg-leader-table';
import { UnitDisSyLeaderTablePage } from '../unit-dis-sy-leader-table/unit-dis-sy-leader-table';
import { UnitDisTableSyPage } from '../unit-dis-table-sy/unit-dis-table-sy';
import { UnitDisTableJgPage } from '../unit-dis-table-jg/unit-dis-table-jg';

@Component({
  selector: 'page-unit-district',
  templateUrl: 'unit-district.html',
})
export class UnitDistrictPage {
  page1: any = UnitDisTableJgPage;
  page2: any = UnitDisTableSyPage;
  page3: any = UnitDisTablePage;
  page4: any = UnitDisJgLeaderTablePage;
  page5: any = UnitDisSyLeaderTablePage;
  page6: any = UnitDisPersonTablePage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public babbDisProvider:BabbDisProvider) {

  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

}
