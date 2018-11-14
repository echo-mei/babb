import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';

@Component({
  selector: 'page-unit-zh-search-result',
  templateUrl: 'unit-zh-search-result.html',
})
export class UnitZhSearchResultPage {

  key: any;
  smallNum: any;
  bigNum: any;
  resultList = [];
  searchList: any;
  waveList: any;

  searchKeyList = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babb: BabbUnitProvider
  ) {

    this.searchList = this.navParams.get('searchList');
    this.key = this.navParams.get('key');
    this.smallNum = this.navParams.get('smallNum');
    this.bigNum = this.navParams.get('bigNum');
    this.getResultList();

    this.getSearchKey();
  }

  getSearchKey() {
    this.searchList.forEach((item, index, list) => {
      item.forEach((item1) => {
        this.searchKeyList.push(item1.dicItemName)
      })
    })
  }

  getResultList() {
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
    this.babb.getAllResult(this.searchList, this.key, this.smallNum, this.bigNum).then(res => {
      this.resultList = res;
    });

  }

  // 点击跳到主页
  onClickHome() {
    this.navCtrl.popToRoot();
  }
}
