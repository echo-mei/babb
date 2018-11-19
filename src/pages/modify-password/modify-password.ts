import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BabbUserProvider } from '../../providers/babb-user/babb-user';


@Component({
  selector: 'page-modify-password',
  templateUrl: 'modify-password.html',
})
export class ModifyPasswordPage {
  userForm: FormGroup;
  user:any;
  oldPassword:any;
  // 输入的旧密码与数据库旧密码对比标志
  oldPasswordFlag:boolean = false;
  // 输入的新密码与数据库旧密码对比标志
  newPasswordFlag:boolean = false;
  newPasswordLenFlag:boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public toastCtrl: ToastController,
    public babbUserProvider: BabbUserProvider
  ) {
    this.user = this.navParams.get("user");
    this.userForm = this.formBuilder.group({
      password: ['', Validators.compose([Validators.required])],
      password1: ['', Validators.compose([Validators.required,Validators.minLength(6),Validators.maxLength(12)])]
    });
    this.getOldPassword();
  }

  // 获取旧密码
  getOldPassword(){
    this.babbUserProvider.getOldPassword(this.user.userId).then(res=>{
      this.oldPassword = res.password;
    })
  }

  onClickModify() {
    this.babbUserProvider.modifyPassword(this.user.userId, this.userForm.controls['password1'].value).then(() => {
      this.toastCtrl.create({
        cssClass: 'mini',
        position: 'middle',
        message: '密码修改成功',
        duration: 1000
      }).present();
      this.navCtrl.pop();
    })
  }

  blurInputPw(){
    this
    if(this.oldPassword != this.userForm.controls['password'].value){
      this.oldPasswordFlag = true;
    }
  }

  focusInputPw(){
    this.oldPasswordFlag = false;
  }

  blurInputPw1(){
    if(this.oldPassword == this.userForm.controls['password1'].value){
      this.newPasswordFlag = true;
    }
    if(this.userForm.controls['password1'].value.length>0 && this.userForm.controls['password1'].value.length < 6 || this.userForm.controls['password1'].value.length > 15){
      this.newPasswordLenFlag = true;
    }
  }

  focusInputPw1(){
    this.newPasswordFlag = false;
    this.newPasswordLenFlag = false;
  }
}
