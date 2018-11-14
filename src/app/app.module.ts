import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';
import { File } from '@ionic-native/file';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';

import { DatabaseProvider } from '../providers/database/database';
import { StorageProvider } from '../providers/storage/storage';
import { BabbUserProvider } from '../providers/babb-user/babb-user';

import * as VConsole from 'vconsole';
import { BabbUnitProvider } from '../providers/babb-unit/babb-unit';
import { TreeProvider } from '../providers/tree/tree';
import { HomePage } from '../pages/home/home';
import { UnitStatisticsPage } from '../pages/unit-statistics/unit-statistics';
import { UnitPage } from '../pages/unit/unit';
import { UnitFuntionPage } from '../pages/unit-funtion/unit-funtion';
import { UnitHcPage } from '../pages/unit-hc/unit-hc';
import { UnitHcTablePage } from '../pages/unit-hc-table/unit-hc-table';
import { UnitSearchPage } from '../pages/unit-search/unit-search';
import { UnitZhSearchPage } from '../pages/unit-zh-search/unit-zh-search';
import { UnitZhSearchResultPage } from '../pages/unit-zh-search-result/unit-zh-search-result';
import { UnitHcTableInfactPage } from '../pages/unit-hc-table-infact/unit-hc-table-infact';
import { UnitHcTableFrzPage } from '../pages/unit-hc-table-frz/unit-hc-table-frz';
import { UnitInterOrgPage } from '../pages/unit-inter-org/unit-inter-org';
import { UnitInterUnitPage } from '../pages/unit-inter-unit/unit-inter-unit';

import { GwSetPage } from '../pages/gw-set/gw-set';
import { PipesModule } from '../pipes/pipes.module';
import { ThreeFilePage } from '../pages/three-file/three-file';
import { HistoryFilePage } from '../pages/history-file/history-file';
new VConsole();

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    UnitPage,
    UnitFuntionPage,
    UnitHcPage,
    UnitHcTablePage,
    UnitStatisticsPage,
    UnitSearchPage,
    UnitZhSearchPage,
    UnitZhSearchResultPage,
    GwSetPage,
    ThreeFilePage,
    HistoryFilePage,
    UnitHcTableInfactPage,
    UnitHcTableFrzPage,
    UnitInterOrgPage,
    UnitInterUnitPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    UnitPage,
    UnitFuntionPage,
    UnitHcPage,
    UnitHcTablePage,
    UnitStatisticsPage,
    UnitSearchPage,
    UnitPage,
    UnitSearchPage,
    UnitZhSearchPage,
    UnitZhSearchResultPage,
    UnitHcTableInfactPage,
    UnitHcTableFrzPage,
    UnitInterOrgPage,
    UnitInterUnitPage,
    GwSetPage,
    ThreeFilePage,
    HistoryFilePage,
    UnitHcTableFrzPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,

    SqliteDbCopy,
    File,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    StorageProvider,
    BabbUserProvider,
    BabbUnitProvider,
    TreeProvider,
  ]
})
export class AppModule {}
