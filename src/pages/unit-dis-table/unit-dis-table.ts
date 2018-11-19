import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from "../../providers/babb-dis/babb-dis";
/**
 * Generated class for the UnitDisTablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-unit-dis-table',
  templateUrl: 'unit-dis-table.html',
})
export class UnitDisTablePage {
  public disTableField: Array<any> = [];
  public disFieldList: any = "";
  public disTableIndex: Array<any> = [];
  public disTableTwos: Array<any> = [];
  public disTableOnes: Array<any> = [];
  public disTableThrees: Array<any> = [];
  public disTableCurCountOne: number;
  public disTableCurLockCountOne: number;
  public disTableInfactCountOne: number;
  public disTableFrzCountOne: number;
  public disTableFreeCountOne: number;
  public disTableCurCountTwo: number;
  public disTableCurLockCountTwo: number;
  public disTableInfactCountTwo: number;
  public disTableFrzCountTwo: number;
  public disTableFreeCountTwo: number;
  public disTableCurCountThree: number;
  public disTableCurLockCountThree: number;
  public disTableInfactCountThree: number;
  public disTableFrzCountThree: number;
  public disTableFreeCountThree: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public babbDisProvider: BabbDisProvider) {
    this.babbDisProvider.getPreparationTable().then((res) => {
      //将表格字段遍历出
      res.forEach((item) => {
        if (this.disTableField.indexOf(item.HC_NAME) < 0) {
          this.disTableField.push(item.HC_NAME);
          this.disTableIndex.push(item.HC_OID);
        }
      });
    }).then(() => {
      this.disTableField.forEach((item, index) => {
        if (index == 0) {
          this.disFieldList += "'" + item + "'";
        } else {
          this.disFieldList += ",'" + item + "'";
        }
      });
      this.babbDisProvider.getPreparationSum("1", this.disFieldList).then((res) => {
        this.disTableCurCountOne = res.curTotal;
        this.disTableCurLockCountOne = res.curLockTotal;
        this.disTableInfactCountOne = res.infactTotal;
        this.disTableFrzCountOne = res.frzTotal;
        this.disTableFreeCountOne = res.freeTotal;
      });
      this.babbDisProvider.getPreparationSum("2", this.disFieldList).then((res) => {
        this.disTableCurCountTwo = res.curTotal;
        this.disTableCurLockCountTwo = res.curLockTotal;
        this.disTableInfactCountTwo = res.infactTotal;
        this.disTableFrzCountTwo = res.frzTotal;
        this.disTableFreeCountTwo = res.freeTotal;
      });
      this.babbDisProvider.getPreparationSum("3", this.disFieldList).then((res) => {
        this.disTableCurCountThree = res.curTotal;
        this.disTableCurLockCountThree = res.curLockTotal;
        this.disTableInfactCountThree = res.infactTotal;
        this.disTableFrzCountThree = res.frzTotal;
        this.disTableFreeCountThree = res.freeTotal;
      });
       //"1","2","3"分别代表合计，区直，街道
      this.babbDisProvider.getPreparationCountTypeSum("1", "CUR_COUNT,CUR_LOCK_COUNT,INFACT_COUNT,FRZ_COUNT,FREE_COUNT").then((res) => {
        this.getFilterData(res, this.disTableOnes)
      });
      this.babbDisProvider.getPreparationCountTypeSum("2", "CUR_COUNT,CUR_LOCK_COUNT,INFACT_COUNT,FRZ_COUNT,FREE_COUNT").then((res) => {
        this.getFilterData(res, this.disTableTwos)
      });
      this.babbDisProvider.getPreparationCountTypeSum("3", "CUR_COUNT,CUR_LOCK_COUNT,INFACT_COUNT,FRZ_COUNT,FREE_COUNT").then((res) => {
        this.getFilterData(res, this.disTableThrees)
      });
    })
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad UnitDisTablePage');
  }
  getFilterData(res, arrayType) {
    let len = this.disTableField.length - res.length;
    let obj = { CUR_COUNT: "", CUR_LOCK_COUNT: "", INFACT_COUNT: "", FRZ_COUNT: "", FREE_COUNT: "", HC_OID: "" };
    for (let i = 0; i < len; i++) {
      res.push(obj);
    };
    for (let i = 0; i < res.length; i++) {
      arrayType.push(obj);
    }
    //找出字段index，匹配在数组相应地位置，避免单元格错位    
    for (let i = 0; i < res.length; i++) {
      let index = this.disTableIndex.indexOf(res[i].HC_OID);
      arrayType[index] = res[i];
    }
  }

}
