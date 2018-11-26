import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from "../../providers/babb-dis/babb-dis";

@Component({
  selector: 'page-unit-dis-table',
  templateUrl: 'unit-dis-table.html',
})
export class UnitDisTablePage {

  // 数据列表
  dataList: any[];


  constructor(public navCtrl: NavController, public navParams: NavParams, public babbDisProvider: BabbDisProvider) {
    this.babbDisProvider.getHcTable().then(res => {
      this.dataList = res;
    });
  }

}
