import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BabbUserProvider } from '../../providers/babb-user/babb-user';
import { HomePage } from '../home/home';
import { AdminHomePage } from '../admin-home/admin-home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;

  showPassword: false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    protected babbUserProvider: BabbUserProvider,
    public toastCtrl:ToastController
  ) {
    this.loginForm = formBuilder.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  clearValue(control) {
    this.loginForm.controls[control].setValue('');
  }

  login() {
    this.babbUserProvider.login(this.loginForm.value.userName, this.loginForm.value.password)
      .then(res => {
        if(res == undefined){
          this.toastCtrl.create({
            cssClass: 'mini',
            position: 'middle',
            message: '账号或密码错误',
            duration: 2000
          }).present();
        }else{
          if(res.userType == 1){
            this.navCtrl.setRoot(AdminHomePage,{user: res});
          }else{
            this.navCtrl.setRoot(HomePage,{user: res});
          }
        }
      });
  }

}
