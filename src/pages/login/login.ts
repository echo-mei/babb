import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BabbUserProvider } from '../../providers/babb-user/babb-user';
import { HomePage } from '../home/home';

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
      .then(r => {
        this.navCtrl.setRoot(HomePage);
      });
  }

}
