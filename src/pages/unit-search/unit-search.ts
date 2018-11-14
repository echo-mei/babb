import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { LoadingController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';

@Component({
  selector: 'page-unit-search',
  templateUrl: 'unit-search.html',
})
export class UnitSearchPage {
  // list = [ {'history': '深圳市宝安区党代表大会常任制工作办公室'}, {'history': '中国深圳市宝安区委基层组织建设工作领导小组办公室( 挂牌名称、合署办公名称 )'}, {'history': '深圳市宝安区老干部活动中心'}];
  list = [];
  newList = [];
  newFont: any;
  historyList: any = [];
  isFirstFocus: number = 1;

  key: any;
  isFocus: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public babb: BabbUnitProvider,
    public loading: LoadingController,
    public storage: StorageProvider
  ) {
    if(this.storage.get('historyList')){
      this.historyList = JSON.parse(this.storage.get('historyList'));
    };
    this.getUnitName();
  }

  getUnitName() {
    this.babb.getUnitName().then(res => {
      this.list = res;
      this.newList = res;
    })
  }

  focusNow() {
    // alert('聚焦了')
    if(this.isFirstFocus > 0){
      this.isFirstFocus -= 1;
      this.isFocus = true;
      return;
    }
    if(!this.key){
      this.isFocus = true;
      return;
    }
    this.isFocus = false;
  }

  clearHis() {
    this.historyList = [];
    this.storage.set('historyList', []);
    this.isFocus = false;
  }

  closeHis() {
    this.isFocus = false;
  }

  getClickItem(item) {
    if(this.historyList.indexOf(item) === -1){
      if(this.historyList.length < 10){
        this.historyList.unshift(item);
      }else{
        this.historyList.splice(-1, 1);
        this.historyList.unshift(item);
      }
    }else {
      this.historyList.splice(this.historyList.indexOf(item), 1);
      this.historyList.unshift(item);
    }
    this.storage.set('historyList', JSON.stringify(this.historyList))
  }

  onClickSearch() {
    this.isFocus = false;
    const loader = this.loading.create({
      content: '加载中',
    })
    loader.present();
    if(!this.key) {
      this.newList = this.list;
      loader.dismiss();
      return;
    }
    this.newList = [];
    this.list.forEach((item, index, list)=> {
      let keyList = this.key.split('');
      keyList.forEach((key, index, list)=>{
        if(item.UNIT_NAME.match(key.trim())){
          if(this.newList.indexOf(item) === -1){
            this.newList.push(item)
          }
        }else {
        }
      })      
    })
    loader.dismiss();
  }
  goBack() {
    this.navCtrl.pop();
  }

}
