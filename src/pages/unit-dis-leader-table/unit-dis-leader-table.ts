import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from "../../providers/babb-dis/babb-dis";

@Component({
  selector: 'page-unit-dis-leader-table',
  templateUrl: 'unit-dis-leader-table.html',
})
export class UnitDisLeaderTablePage {

  jgLeaderSum = {};
  jgUnitLeaderCountList = [];
  jgOrgLeaderCountList = [];

  syLeaderSum = {};
  syUnitLeaderCountList = [];
  syOrgLeaderCountList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public babbDisProvider: BabbDisProvider) {
    this.babbDisProvider.getLeaderSum(1).then(
      list => {this.jgLeaderSum = list[0];}
    );
    this.babbDisProvider.getLeaderCountListByCondition(1, '010110').then(
      list => {this.jgUnitLeaderCountList = list;}
    );
    this.babbDisProvider.getLeaderCountListByCondition(1, '010120').then(
      list => {this.jgOrgLeaderCountList = list;}
    );
    this.babbDisProvider.getLeaderSum(2).then(
      list => {this.syLeaderSum = list[0];}
    );
    this.babbDisProvider.getLeaderCountListByCondition(2, '010110').then(
      list => {this.syUnitLeaderCountList = list;}
    );
    this.babbDisProvider.getLeaderCountListByCondition(2, '010120').then(
      list => {this.syOrgLeaderCountList = list;}
    );
  }

}
