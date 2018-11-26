import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UnitDisTablePage } from "../unit-dis-table/unit-dis-table";
import { UnitDisLeaderTablePage} from "../unit-dis-leader-table/unit-dis-leader-table";
import { BabbDisProvider} from "../../providers/babb-dis/babb-dis";
import { UnitDisPersonTablePage } from '../unit-dis-person-table/unit-dis-person-table';

@Component({
  selector: 'page-unit-district',
  templateUrl: 'unit-district.html',
})
export class UnitDistrictPage {
  page1:any=UnitDisTablePage;
  page2:any=UnitDisLeaderTablePage;
  page3:any=UnitDisPersonTablePage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public babbDisProvider:BabbDisProvider) {

  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }

}
