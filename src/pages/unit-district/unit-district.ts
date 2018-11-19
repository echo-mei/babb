import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UnitDisTablePage } from "../unit-dis-table/unit-dis-table";
import { UnitDisLeaderTablePage} from "../unit-dis-leader-table/unit-dis-leader-table";
import { BabbDisProvider} from "../../providers/babb-dis/babb-dis";
/**
 * Generated class for the UnitDistrictPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-unit-district',
  templateUrl: 'unit-district.html',
})
export class UnitDistrictPage {
page1:any=UnitDisTablePage;
page2:any=UnitDisLeaderTablePage;
page3:any=UnitDisTablePage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public babbDisProvider:BabbDisProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitDistrictPage');
  }

}
