import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';
import { HomePage } from '../pages/home/home';
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
    db: DatabaseProvider,
    androidPermissions: AndroidPermissions
  ) {
    platform.ready().then(() => {
      db.initDatabase().then(() => {
        this.rootPage = LoginPage;
      });
      statusBar.overlaysWebView(true);
      splashScreen.hide();
    });
  }

}

