import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider, UserDatabaseProvider } from '../providers/database/database';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    protected db: DatabaseProvider,
    protected userDb: UserDatabaseProvider,
    public androidPermissions: AndroidPermissions,
  ) {
    platform.ready().then(() => {
      if (platform.is('cordova')) {
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]).then(
          () => {
            this.initApp();
            statusBar.overlaysWebView(true);
            splashScreen.hide();
          }
        );
      }else {
        this.initApp();
      }
    });
  }

  initApp() {
    this.userDb.initDatabase().then(()=>{
      this.db.initDatabase().then(() => {
        this.rootPage = LoginPage;
      });
    });
  }

}

