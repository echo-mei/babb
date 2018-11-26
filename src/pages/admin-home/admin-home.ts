import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App, ToastController } from 'ionic-angular';
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
    public toastCtrl:ToastController,
    public app: App
  ) {
    this.user = this.navParams.get("user");
    this.getExceptMeUsers();
  }

  getExceptMeUsers(){
    this.babbUserProvider.getExceptMeUsers(this.user.identifyId).then(res => {
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
      onUpdate: this.getExceptMeUsers.bind(this)
    });
  }

  // 点击修改
  onClickUpdate(user){
    this.navCtrl.push(UserUpdatePage,{
      user:user,
      onUpdate: this.getExceptMeUsers.bind(this)
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
                this.getExceptMeUsers();
                this.toastCtrl.create({
                  cssClass: 'mini',
                  position: 'middle',
                  message: '密码重置为"88888888"',
                  duration: 1000
                }).present();
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
                this.toastCtrl.create({
                  cssClass: 'mini',
                  position: 'middle',
                  message: '删除成功',
                  duration: 1000
                }).present();
                this.getExceptMeUsers();
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
