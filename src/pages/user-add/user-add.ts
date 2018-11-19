import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BabbUserProvider } from '../../providers/babb-user/babb-user';


@Component({
  selector: 'page-user-add',
  templateUrl: 'user-add.html',
})
export class UserAddPage {

  userForm: FormGroup;
  // 添加新用户时判断输入的用户名是否已经存在
  hasUserFlag:boolean = false;
  onUpdate: () => {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public toastCtrl:ToastController,
    public babbUserProvider:BabbUserProvider
  ) {
      this.onUpdate = this.navParams.get('onUpdate');
      this.userForm = this.formBuilder.group({
        userId: ['', Validators.compose([Validators.required])],
        userName: ['', Validators.compose([Validators.required])]
      });
  }

  onClickAdd(){
    this.babbUserProvider.addUser(
      this.userForm.controls['userId'].value,
      this.userForm.controls['userName'].value
    ).then(()=>{
        this.toastCtrl.create({
          cssClass: 'mini',
          position: 'middle',
          message: '创建成功',
          duration: 1000
        }).present();
        this.onUpdate && this.onUpdate();
        this.navCtrl.pop();
      });
  }

  blurInput(){
    this.babbUserProvider.getUser(this.userForm.controls['userId'].value).then(res => {
      if(res.length > 0){
        this.hasUserFlag = true;
      }
    });
  }

  focusInput(){
    this.hasUserFlag = false;
  }

}
