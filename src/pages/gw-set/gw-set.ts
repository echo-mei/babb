///<reference path="../../services/jquery.d.ts"/>
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-gw-set',
  templateUrl: 'gw-set.html',
})
export class GwSetPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // 别改
    $(function(){
      $("#jf-organizChart-org").jOrgChart({
        chartElement : '#chart',
      });
    })
  }

}
