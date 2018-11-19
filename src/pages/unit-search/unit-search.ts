import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { StorageProvider } from '../../providers/storage/storage';
import { UnitPage } from '../unit/unit';

@Component({
  selector: 'page-unit-search',
  templateUrl: 'unit-search.html',
})
export class UnitSearchPage {

  unitList: any[];
  key: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public babbUnitProvider: BabbUnitProvider,
    public storage: StorageProvider
  ) {
  }

  search() {
    this.babbUnitProvider.findUnitListByName(this.key).then(
      (res) => {
        this.unitList = res;
      }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }

  onClickUnit(unit) {
    let historyUnitList = this.storage.historyUnitList ? this.storage.historyUnitList : [];
    historyUnitList.find((history, index) => {
      if(history.unitOid == unit.unitOid) {
        historyUnitList.splice(index, 1);
      };
      return history.unitOid == unit.unitOid;
    });
    if(historyUnitList.length >= 10) {
      historyUnitList.splice(historyUnitList.length-1, 1);
    }
    historyUnitList.unshift(unit);
    this.storage.historyUnitList = historyUnitList;
    this.navCtrl.push(UnitPage, {
      unit: unit
    });
  }

}
