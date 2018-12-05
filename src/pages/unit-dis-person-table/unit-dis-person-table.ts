///<reference path="../../services/jquery.d.ts"/>
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BabbDisProvider } from '../../providers/babb-dis/babb-dis';

@Component({
  selector: 'page-unit-dis-person-table',
  templateUrl: 'unit-dis-person-table.html',
})
export class UnitDisPersonTablePage {

  gyPersonList = [];
  lpPersonList = [];
  gmfwPersonList = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public babbDisProvider: BabbDisProvider) {
    this.babbDisProvider.getPersonStatistics(1).then(res => {this.gyPersonList = res});
    this.babbDisProvider.getPersonStatistics(2).then(res => {this.lpPersonList = res});
    this.babbDisProvider.getPersonStatistics(3).then(res => {this.gmfwPersonList = res});
  }

}
