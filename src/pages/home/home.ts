import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { listener } from '@angular/core/src/render3/instructions';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { UnitStatisticsPage } from '../unit-statistics/unit-statistics';
import { UnitPage } from '../unit/unit';
import { UnitSearchPage } from '../unit-search/unit-search';
import { UnitZhSearchPage } from '../unit-zh-search/unit-zh-search';

import { UNIT_CATEGORY } from '../../providers/babb-dic/babb-dic';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  // 右侧树
  tree: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public babbUnitProvider: BabbUnitProvider
  ) {
    this.getUnitTree();
  }

  getUnitTree() {
    this.tree = Object.assign([], UNIT_CATEGORY);
    this.babbUnitProvider.getUnitTree().then(res => {
      res.forEach((unit) => {
        let node = this.tree.find((category) => {
          return category.dicItemCode == unit.unitCategoryCode;
        })
        if(!node.units) node.units = [];
        else node.units.push(unit);
      });
    });
  }

  goUnitStatistics() {
    this.navCtrl.push(UnitStatisticsPage);
  }


  clickUnit(unit){
    this.navCtrl.push(UnitPage,{unit:unit});
  }

  toSearch() {
    this.navCtrl.push(UnitZhSearchPage);
  }

  toUnitSearch() {
    this.navCtrl.push(UnitSearchPage);
  }

}
