import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-history-file',
  templateUrl: 'history-file.html',
})
export class HistoryFilePage {

  fileList = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {

    this.initData();

  }

  initData() {
    this.fileList = [
      {
        'fileName': 'a.pdf',
        'fileTitle': '中共深圳至宝安区委组织部三定文件'
      },
      {
        'fileName': 'b.pdf',
        'fileTitle': '中共深圳市宝安区委组织部三定文件中共深圳市宝安区委组织部三定文件室'
      },
      {
        'fileName': 'c.pdf',
        'fileTitle': '中共深圳市宝安区委组织部三定文件'
      }
    ]
  }

  goBack() {
    this.navCtrl.pop();
  }

}
