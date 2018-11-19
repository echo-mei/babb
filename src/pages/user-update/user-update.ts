import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BabbUserProvider } from '../../providers/babb-user/babb-user';


@Component({
  selector: 'page-user-update',
  templateUrl: 'user-update.html',
})
export class UserUpdatePage {
  userForm: FormGroup;
  user: any;
  // 添加新用户时判断输入的用户名吃否已经存在
  hasUserFlag: boolean = false;
  onUpdate: () => {};
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public babbUserProvider: BabbUserProvider,
    public toastCtrl: ToastController
  ) {
    this.user = this.navParams.get('user');
    this.onUpdate = this.navParams.get('onUpdate');
    this.userForm = this.formBuilder.group({
      userId: [this.user.userId, Validators.compose([Validators.required])],
      userName: [this.user.userName, Validators.compose([Validators.required])],
      userType: [this.user.userType, Validators.compose([Validators.required])]
    });
  }

  onClickUpdate() {
    let params = {
      identifyId:this.user.identifyId,
      ...this.userForm.value
    }
    this.babbUserProvider.updateUser(params).then(() => {
      this.toastCtrl.create({
        cssClass: 'mini',
        position: 'middle',
        message: '修改成功',
        duration: 1000
      }).present();
      this.onUpdate && this.onUpdate();
      this.navCtrl.pop();
    })
  }

  blurInput() {
    this.babbUserProvider.getUser(this.userForm.controls['userId'].value).then(res => {
      if (res.length > 0) {
        this.hasUserFlag = true;
      }
    });
  }

  focusInput() {
    this.hasUserFlag = false;
  }
}
