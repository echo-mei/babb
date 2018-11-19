import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from "../../providers/babb-dis/babb-dis";
import { VERSION } from '@angular/common';
/**
 * Generated class for the UnitDisLeaderTablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-unit-dis-leader-table',
  templateUrl: 'unit-dis-leader-table.html',
})
export class UnitDisLeaderTablePage {
  //机关单位
  public disLeaderUnitfield: Array<any> = [];
  public disLeaderInstfield: Array<any> = [];
  public OffUnitLeaderCurCountDeOne: number = 0;
  public OffUnitLeaderInfactCountDeOne: number = 0;
  public OffUnitLeaderFreeCountDeOne: number = 0;
  public OffUnitLeaderSmCurCountDeOne: number = 0;
  public OffUnitLeaderSmInfactCountDeOne: number = 0;
  public OffUnitLeaderSmFreeCountDeOne: number = 0;
  public OffInstLeaderSmCurCountDeOne: number = 0;
  public OffInstLeaderSmInfactCountDeOne: number = 0;
  public OffInstLeaderSmFreeCountDeOne: number = 0;
  public OffUnitLeaderFieldArray: Array<any> = [];
  public OffInstLeaderFieldArray: Array<any> = [];
  // ////////////////////////////////////////
  public OffUnitLeaderCurCountDeTwo: number = 0;
  public OffUnitLeaderInfactCountDeTwo: number = 0;
  public OffUnitLeaderFreeCountDeTwo: number = 0;
  public OffUnitLeaderSmCurCountDeTwo: number = 0;
  public OffUnitLeaderSmInfactCountDeTwo: number = 0;
  public OffUnitLeaderSmFreeCountDeTwo: number = 0;
  public OffInstLeaderSmCurCountDeTwo: number = 0;
  public OffInstLeaderSmInfactCountDeTwo: number = 0;
  public OffInstLeaderSmFreeCountDeTwo: number = 0;
  public OffUnitLeaderFieldArrayTwo: Array<any> = [];
  public OffInstLeaderFieldArrayTwo: Array<any> = [];
  // ////////////////////////////////////////
  public OffUnitLeaderCurCountDeThree: number = 0;
  public OffUnitLeaderInfactCountDeThree: number = 0;
  public OffUnitLeaderFreeCountDeThree: number = 0;
  public OffUnitLeaderSmCurCountDeThree: number = 0;
  public OffUnitLeaderSmInfactCountDeThree: number = 0;
  public OffUnitLeaderSmFreeCountDeThree: number = 0;
  public OffInstLeaderSmCurCountDeThree: number = 0;
  public OffInstLeaderSmInfactCountDeThree: number = 0;
  public OffInstLeaderSmFreeCountDeThree: number = 0;
  public OffUnitLeaderFieldArrayThree: Array<any> = [];
  public OffInstLeaderFieldArrayThree: Array<any> = [];
  //事业单位
  public disCauLeaderUnitfield: Array<any> = [];
  public disCauLeaderInstfield: Array<any> = [];
  public CauUnitLeaderCurCountDeOne: number = 0;
  public CauUnitLeaderInfactCountDeOne: number = 0;
  public CauUnitLeaderFreeCountDeOne: number = 0;
  public CauUnitLeaderSmCurCountDeOne: number = 0;
  public CauUnitLeaderSmInfactCountDeOne: number = 0;
  public CauUnitLeaderSmFreeCountDeOne: number = 0;
  public CauInstLeaderSmCurCountDeOne: number = 0;
  public CauInstLeaderSmInfactCountDeOne: number = 0;
  public CauInstLeaderSmFreeCountDeOne: number = 0;
  public CauUnitLeaderFieldArray: Array<any> = [];
  public CauInstLeaderFieldArray: Array<any> = [];
  ////////
  public CauUnitLeaderCurCountDeTwo: number = 0;
  public CauUnitLeaderInfactCountDeTwo: number = 0;
  public CauUnitLeaderFreeCountDeTwo: number = 0;
  public CauUnitLeaderSmCurCountDeTwo: number = 0;
  public CauUnitLeaderSmInfactCountDeTwo: number = 0;
  public CauUnitLeaderSmFreeCountDeTwo: number = 0;
  public CauInstLeaderSmCurCountDeTwo: number = 0;
  public CauInstLeaderSmInfactCountDeTwo: number = 0;
  public CauInstLeaderSmFreeCountDeTwo: number = 0;
  public CauUnitLeaderFieldArrayTwo: Array<any> = [];
  public CauInstLeaderFieldArrayTwo: Array<any> = [];
  ///////////
  public CauUnitLeaderCurCountDeThree: number = 0;
  public CauUnitLeaderInfactCountDeThree: number = 0;
  public CauUnitLeaderFreeCountDeThree: number = 0;
  public CauUnitLeaderSmCurCountDeThree: number = 0;
  public CauUnitLeaderSmInfactCountDeThree: number = 0;
  public CauUnitLeaderSmFreeCountDeThree: number = 0;
  public CauInstLeaderSmCurCountDeThree: number = 0;
  public CauInstLeaderSmInfactCountDeThree: number = 0;
  public CauInstLeaderSmFreeCountDeThree: number = 0;
  public CauUnitLeaderFieldArrayThree: Array<any> = [];
  public CauInstLeaderFieldArrayThree: Array<any> = [];
  /////
  public disLeaderUnitfieldIndex: Array<any> = [];
  public disLeaderInstfieldIndex: Array<any> = [];
  public disCauLeaderUnitfieldIndex: Array<any> = [];
  public disCauLeaderInstfieldIndex: Array<any> = [];
  public OffUnitLeaderFieldArrays: Array<any> = [];
  public OffInstLeaderFieldArrays: Array<any> = [];
  public OffUnitLeaderFieldArrayTwos: Array<any> = [];
  public OffInstLeaderFieldArrayTwos: Array<any> = [];
  public OffUnitLeaderFieldArrayThrees: Array<any> = [];
  public OffInstLeaderFieldArrayThrees: Array<any> = [];
  public CauUnitLeaderFieldArrays: Array<any> = [];
  public CauInstLeaderFieldArrays: Array<any> = [];
  public CauUnitLeaderFieldArrayTwos: Array<any> = [];
  public CauInstLeaderFieldArrayTwos: Array<any> = [];
  public CauUnitLeaderFieldArrayThrees: Array<any> = [];
  public CauInstLeaderFieldArrayThrees: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public babbDisProvider: BabbDisProvider) {
    //获取单位领导和内下设机构领导字段列表
    this.babbDisProvider.getLeaderField("1", "'010110'").then((res) => {
      res.forEach((item) => {
        if (this.disLeaderUnitfield.indexOf(item.DUTY_LEVEL_NAME) < 0) {
          this.disLeaderUnitfield.push(item.DUTY_LEVEL_NAME);
          this.disLeaderUnitfieldIndex.push(item.DUTY_LEVEL);
        }
      });
    });
    this.babbDisProvider.getLeaderField("1", "'010120'").then((res) => {
      res.forEach((item) => {
        if (this.disLeaderInstfield.indexOf(item.DUTY_LEVEL_NAME) < 0) {
          this.disLeaderInstfield.push(item.DUTY_LEVEL_NAME);
          this.disLeaderInstfieldIndex.push(item.DUTY_LEVEL);
        }
      })
    });
    this.babbDisProvider.getLeaderField("2", "'010110'").then((res) => {
      res.forEach((item) => {
        if (this.disCauLeaderUnitfield.indexOf(item.DUTY_LEVEL_NAME) < 0) {
          this.disCauLeaderUnitfield.push(item.DUTY_LEVEL_NAME);
          this.disCauLeaderUnitfieldIndex.push(item.DUTY_LEVEL);
        }
      });
    });
    this.babbDisProvider.getLeaderField("2", "'010120'").then((res) => {
      res.forEach((item) => {
        if (this.disCauLeaderInstfield.indexOf(item.DUTY_LEVEL_NAME) < 0) {
          this.disCauLeaderInstfield.push(item.DUTY_LEVEL_NAME);
          this.disCauLeaderInstfieldIndex.push(item.DUTY_LEVEL);
        }
      });
    });
    //获取总职数
    this.babbDisProvider.getOffcountType("1", "1").then((res) => {
      this.OffUnitLeaderCurCountDeOne = res.curCount;
      this.OffUnitLeaderInfactCountDeOne = res.infactCount;
      this.OffUnitLeaderFreeCountDeOne = res.freeCount;
    });
    this.babbDisProvider.getOffcountType("1", "2").then((res) => {
      this.OffUnitLeaderCurCountDeTwo = res.curCount;
      this.OffUnitLeaderInfactCountDeTwo = res.infactCount;
      this.OffUnitLeaderFreeCountDeTwo = res.freeCount;
    });
    this.babbDisProvider.getOffcountType("1", "3").then((res) => {
      this.OffUnitLeaderCurCountDeThree = res.curCount;
      this.OffUnitLeaderInfactCountDeThree = res.infactCount;
      this.OffUnitLeaderFreeCountDeThree = res.freeCount;
    });
    this.babbDisProvider.getOffcountType("2", "1").then((res) => {
      this.CauUnitLeaderCurCountDeOne = res.curCount;
      this.CauUnitLeaderInfactCountDeOne = res.infactCount;
      this.CauUnitLeaderFreeCountDeOne = res.freeCount;
    });
    this.babbDisProvider.getOffcountType("2", "2").then((res) => {
      this.CauUnitLeaderCurCountDeTwo = res.curCount;
      this.CauUnitLeaderInfactCountDeTwo = res.infactCount;
      this.CauUnitLeaderFreeCountDeTwo = res.freeCount;
    });
    this.babbDisProvider.getOffcountType("2", "3").then((res) => {
      this.CauUnitLeaderCurCountDeThree = res.curCount;
      this.CauUnitLeaderInfactCountDeThree = res.infactCount;
      this.CauUnitLeaderFreeCountDeThree = res.freeCount;
    });
    //获取小计的总数
    this.babbDisProvider.getOffsmallCount("1", "1", "'010110'").then((res) => {
      this.OffUnitLeaderSmCurCountDeOne = res.curCount;
      this.OffUnitLeaderSmInfactCountDeOne = res.infactCount;
      this.OffUnitLeaderSmFreeCountDeOne = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("1", "2", "'010110'").then((res) => {
      this.OffUnitLeaderSmCurCountDeTwo = res.curCount;
      this.OffUnitLeaderSmInfactCountDeTwo = res.infactCount;
      this.OffUnitLeaderSmFreeCountDeTwo = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("1", "3", "'010110'").then((res) => {
      this.OffUnitLeaderSmCurCountDeThree = res.curCount;
      this.OffUnitLeaderSmInfactCountDeThree = res.infactCount;
      this.OffUnitLeaderSmFreeCountDeThree = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("1", "1", "'010120'").then((res) => {
      this.OffInstLeaderSmCurCountDeOne = res.curCount;
      this.OffInstLeaderSmInfactCountDeOne = res.infactCount;
      this.OffInstLeaderSmFreeCountDeOne = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("1", "2", "'010120'").then((res) => {
      this.OffInstLeaderSmCurCountDeTwo = res.curCount;
      this.OffInstLeaderSmInfactCountDeTwo = res.infactCount;
      this.OffInstLeaderSmFreeCountDeTwo = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("1", "3", "'010120'").then((res) => {
      this.OffInstLeaderSmCurCountDeThree = res.curCount;
      this.OffInstLeaderSmInfactCountDeThree = res.infactCount;
      this.OffInstLeaderSmFreeCountDeThree = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("2", "1", "'010110'").then((res) => {
      this.CauUnitLeaderSmCurCountDeOne = res.curCount;
      this.CauUnitLeaderSmInfactCountDeOne = res.infactCount;
      this.CauUnitLeaderSmFreeCountDeOne = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("2", "2", "'010110'").then((res) => {
      this.CauUnitLeaderSmCurCountDeTwo = res.curCount;
      this.CauUnitLeaderSmInfactCountDeTwo = res.infactCount;
      this.CauUnitLeaderSmFreeCountDeTwo = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("2", "3", "'010110'").then((res) => {
      this.CauUnitLeaderSmCurCountDeThree = res.curCount;
      this.CauUnitLeaderSmInfactCountDeThree = res.infactCount;
      this.CauUnitLeaderSmFreeCountDeThree = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("2", "1", "'010120'").then((res) => {
      this.CauInstLeaderSmCurCountDeOne = res.curCount;
      this.CauInstLeaderSmInfactCountDeOne = res.infactCount;
      this.CauInstLeaderSmFreeCountDeOne = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("2", "2", "'010120'").then((res) => {
      this.CauInstLeaderSmCurCountDeTwo = res.curCount;
      this.CauInstLeaderSmInfactCountDeTwo = res.infactCount;
      this.CauInstLeaderSmFreeCountDeTwo = res.freeCount;
    });
    this.babbDisProvider.getOffsmallCount("2", "3", "'010120'").then((res) => {
      this.CauInstLeaderSmCurCountDeThree = res.curCount;
      this.CauInstLeaderSmInfactCountDeThree = res.infactCount;
      this.CauInstLeaderSmFreeCountDeThree = res.freeCount;
    });
    ///按照DUTY_LEVEL升序获取相应字段的数据
    this.babbDisProvider.getOffFieldData("1", "1", "'010110'").then((res) => {
      this.getFilterData(res, this.disLeaderUnitfieldIndex, this.OffUnitLeaderFieldArray, this.OffUnitLeaderFieldArrays, this.disLeaderUnitfield);
    });
    this.babbDisProvider.getOffFieldData("1", "1", "'010120'").then((res) => {
      this.getFilterData(res, this.disLeaderInstfieldIndex, this.OffInstLeaderFieldArray, this.OffInstLeaderFieldArrays, this.disLeaderInstfield)
    });
    this.babbDisProvider.getOffFieldData("1", "2", "'010110'").then((res) => {
      this.getFilterData(res, this.disLeaderUnitfieldIndex, this.OffUnitLeaderFieldArrayTwo, this.OffUnitLeaderFieldArrayTwos, this.disLeaderUnitfield)
    });
    this.babbDisProvider.getOffFieldData("1", "2", "'010120'").then((res) => {
      this.getFilterData(res, this.disLeaderInstfieldIndex, this.OffInstLeaderFieldArrayTwo, this.OffInstLeaderFieldArrayTwos, this.disLeaderInstfield);
    });
    this.babbDisProvider.getOffFieldData("1", "3", "'010110'").then((res) => {
      this.getFilterData(res, this.disLeaderUnitfieldIndex, this.OffUnitLeaderFieldArrayThree, this.OffUnitLeaderFieldArrayThrees, this.disLeaderUnitfield);
      console.log(this.OffUnitLeaderFieldArrayThrees);
    });
    this.babbDisProvider.getOffFieldData("1", "3", "'010120'").then((res) => {
      this.getFilterData(res, this.disLeaderInstfieldIndex, this.OffInstLeaderFieldArrayThree, this.OffInstLeaderFieldArrayThrees, this.disLeaderInstfield);
    });
    /////////////////////////////////////////////////////////
    this.babbDisProvider.getOffFieldData("2", "1", "'010110'").then((res) => {
      this.getFilterData(res, this.disCauLeaderUnitfieldIndex, this.CauUnitLeaderFieldArray, this.CauUnitLeaderFieldArrays, this.disCauLeaderUnitfield);
    });
    this.babbDisProvider.getOffFieldData("2", "1", "'010120'").then((res) => {
      this.getFilterData(res, this.disCauLeaderInstfieldIndex, this.CauInstLeaderFieldArray, this.CauInstLeaderFieldArrays, this.disCauLeaderInstfield);
    });
    this.babbDisProvider.getOffFieldData("2", "2", "'010110'").then((res) => {
      this.getFilterData(res, this.disCauLeaderUnitfieldIndex, this.CauUnitLeaderFieldArrayTwo, this.CauUnitLeaderFieldArrayTwos, this.disCauLeaderUnitfield);
    });
    this.babbDisProvider.getOffFieldData("2", "2", "'010120'").then((res) => {
      this.getFilterData(res, this.disCauLeaderInstfieldIndex, this.CauInstLeaderFieldArrayTwo, this.CauInstLeaderFieldArrayTwos, this.disCauLeaderInstfield);
    });
    this.babbDisProvider.getOffFieldData("2", "3", "'010110'").then((res) => {
      this.getFilterData(res, this.disCauLeaderUnitfieldIndex, this.CauUnitLeaderFieldArrayThree, this.CauUnitLeaderFieldArrayThrees, this.disCauLeaderUnitfield);
    });
    this.babbDisProvider.getOffFieldData("2", "3", "'010120'").then((res) => {
      this.getFilterData(res, this.disCauLeaderInstfieldIndex, this.CauInstLeaderFieldArrayThree, this.CauInstLeaderFieldArrayThrees, this.disCauLeaderInstfield)
    });
  }

  ionViewDidLoad() {

  }

  getFilterData(res, arrayIndex, arrayType, arrayTypes, field) {
    //将相同的字段级别合并
    for (let i = 0; i < res.length; i++) {
      if (i > 0) {
        if (res[i].DUTY_LEVEL == res[i - 1].DUTY_LEVEL) {
          let obj = {
            DUTY_LEVEL: res[i].DUTY_LEVEL,
            CUR_COUNT: res[i].CUR_COUNT + res[i - 1].CUR_COUNT,
            INFACT_COUNT: res[i].INFACT_COUNT + res[i - 1].INFACT_COUNT,
            FREE_COUNT: res[i].FREE_COUNT + res[i - 1].FREE_COUNT
          }
          arrayType.push(obj);
          let index = arrayType.length - 1;
          arrayType.splice(index - 1, 1);
        } else {
          arrayType.push(res[i]);
        }
      }
      else {
        arrayType.push(res[i]);
      }
    }
    let len = field.length - arrayType.length;
    let obj = { DUTY_LEVEL: "", CUR_COUNT: "", INFACT_COUNT: "", FREE_COUNT: "" }
    for (let i = 0; i < len; i++) {
      arrayType.push(obj);
    }
    for (let i = 0; i < field.length; i++) {
      arrayTypes.push(obj);
    }
    for (let i = 0; i < arrayType.length; i++) {
      let index = arrayIndex.indexOf(arrayType[i].DUTY_LEVEL);
      arrayTypes[index] = arrayType[i];
    }
  }

}
