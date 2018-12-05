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
import { ModifyPasswordPage } from '../modify-password/modify-password';
import { UnitDistrictPage } from '../unit-district/unit-district';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  versionInfo: string = '';

  // 右侧树
  tree: any[];
  user:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: DatabaseProvider,
    public babbUnitProvider: BabbUnitProvider
  ) {
    this.user = this.navParams.get("user");
    this.getUnitTree();
    this.babbUnitProvider.getVersion().then(
      data => {
        this.versionInfo = data;
      }
    );
  }

  getUnitTree() {
    // this.tree = Object.assign([], UNIT_CATEGORY);
    this.tree = [];
    this.babbUnitProvider.getUnitTree().then(res => {
      res.forEach((unit) => {
        if(unit.streetOffFlag == 'Y'){
          let group = this.tree.find((g) => {
            return g.dicItemCode == "0";
          });
          if(group) {
            group.units.push(unit);
          }else {
            this.tree.push({
              dicItemCode: "0",
              dicItemName: "街道",
              units: [unit]
            });
          }
        }else{
          let group = this.tree.find((g) => {
            return g.dicItemCode == unit.unitCategoryCode;
          });
          if(group) {
            group.units.push(unit);
          }else {
            this.tree.push({
              dicItemCode: unit.unitCategoryCode,
              dicItemName: unit.unitCategoryName,
              units: [unit]
            });
          }
        }
      });
      // 将街道放置在最后
      let index = this.tree.findIndex((g) => {
        return g.dicItemCode == "0";
      });
      let group = this.tree.splice(index,1);
      this.tree.push(group[0]);
    });
  }

  goUnitStatistics() {
    this.navCtrl.push(UnitStatisticsPage);
  }


  onClickUnit(unit){
    this.navCtrl.push(UnitPage,{unit:unit});
  }

  toSearch() {
    this.navCtrl.push(UnitZhSearchPage);
  }

  toUnitSearch() {
    this.navCtrl.push(UnitSearchPage);
  }

  goUnitDistrict() {
    this.navCtrl.push(UnitDistrictPage);
  }

  // 点击修改密码
  onClickModifyPw(){
    this.navCtrl.push(ModifyPasswordPage,{user:this.user});
  }
}
