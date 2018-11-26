import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitPage } from '../unit/unit';

@Component({
  selector: 'page-unit-zh-search-result',
  templateUrl: 'unit-zh-search-result.html',
})
export class UnitZhSearchResultPage {

  key: any;
  smallNum: any;
  bigNum: any;
  searchList: any;

  resultList = [];

  searchKeyList = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babb: BabbUnitProvider
  ) {
    Object.assign(this, navParams.data);
    this.getSearchKey();
    this.getResultList();
  }

  getSearchKey() {
    this.searchList.forEach((item) => {
      item.forEach((item1) => {
        this.searchKeyList.push(item1.dicItemName)
      })
    })
  }

  getResultList() {
    if(this.smallNum || this.bigNum) {
      parseInt(this.smallNum) ? this.smallNum = this.smallNum : this.smallNum = 0;
      parseInt(this.bigNum) ? this.bigNum = this.bigNum : this.bigNum = 999999;
      if (parseInt(this.smallNum) >= this.bigNum) {
        this.bigNum = 9999999999;
      }
      if (parseInt(this.smallNum) < 0) {
        this.smallNum = 0;
      }
      if (parseInt(this.bigNum) < 0) {
        this.bigNum = 9999999;
      }
    }else {
      this.smallNum = '';
      this.bigNum = '';
    }
    
    this.babb.getAllResult(this.searchList, this.key, this.smallNum, this.bigNum).then(res => {
      this.resultList = res;
    });
  }

  goUnit(result) {
    this.navCtrl.push(UnitPage, {
      unit: result.UNIT_OID
    });
  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
