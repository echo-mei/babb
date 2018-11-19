import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';
import { BabbUserProvider } from '../../providers/babb-user/babb-user';
import { UserAddPage } from '../user-add/user-add';
import { UserUpdatePage } from '../user-update/user-update';
import { LoginPage } from '../login/login';
import { ModifyPasswordPage } from '../modify-password/modify-password';

@Component({
  selector: 'page-admin-home',
  templateUrl: 'admin-home.html',
})
export class AdminHomePage {

  user:any;
  // 用户列表
  userList:Array<Object>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl:AlertController,
    public babbUserProvider:BabbUserProvider,
    public app: App
  ) {
    this.user = this.navParams.get("user");
    this.getNormalUser();
  }

  getNormalUser(){
    this.babbUserProvider.getNormalUsers().then(res => {
      this.userList = res;
    })
  }

  // 点击修改密码
  onClickModifyPW(){
    this.navCtrl.push(ModifyPasswordPage,{user:this.user});
  }

  // 点击新增
  onClickAdd(){
    this.navCtrl.push(UserAddPage,{
      onUpdate: this.getNormalUser.bind(this)
    });
  }

  // 点击修改
  onClickUpdate(user){
    this.navCtrl.push(UserUpdatePage,{
      user:user,
      onUpdate: this.getNormalUser.bind(this)
    });
  }

  // 点击重置密码
  onClickResetPassword(user){
    let alert = this.alertCtrl.create({
      message: '确认重置密码吗？',
      buttons: [
        { text: '取消', role: 'cancel' },
        {
          text: '确定', handler: () => {
            this.babbUserProvider.modifyPassword(user.userId,"88888888").then(
              () => {
                this.getNormalUser();
              }
            );
          }
        }
      ]
    });
    alert.present();
  }
  // 点击删除
  onClickDelete(user){
    let alert = this.alertCtrl.create({
      message: '确认删除该用户吗？',
      buttons: [
        { text: '取消', role: 'cancel' },
        {
          text: '确定', handler: () => {
            this.babbUserProvider.deleteUser(user.userId).then(
              () => {
                this.getNormalUser();
              }
            );
          }
        }
      ]
    });
    alert.present();
  }

  // 点击退出
  onClickExit(){
    this.app.getRootNav().setRoot( LoginPage);
  }
}
