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
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

import { MyApp } from './app.component';

import { DatabaseProvider, UserDatabaseProvider } from '../providers/database/database';
import { StorageProvider } from '../providers/storage/storage';
import { BabbUserProvider } from '../providers/babb-user/babb-user';
import { FileProvider } from '../providers/file/file';
import { BabbUnitProvider } from '../providers/babb-unit/babb-unit';
import { TreeProvider } from '../providers/tree/tree';
import { BabbDisProvider } from '../providers/babb-dis/babb-dis';

import * as VConsole from 'vconsole';
import { LoginPage } from '../pages/login/login';
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
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { GwSetPage } from '../pages/gw-set/gw-set';
import { PipesModule } from '../pipes/pipes.module';
import { ThreeFilePage } from '../pages/three-file/three-file';
import { HistoryFilePage } from '../pages/history-file/history-file';
import { UserAddPage } from '../pages/user-add/user-add';
import { UserUpdatePage } from '../pages/user-update/user-update';
import { ModifyPasswordPage } from '../pages/modify-password/modify-password';
import { UnitDisLeaderTablePage } from '../pages/unit-dis-leader-table/unit-dis-leader-table';
import { UnitDisTablePage } from '../pages/unit-dis-table/unit-dis-table';
import { UnitDistrictPage } from '../pages/unit-district/unit-district';
import { UnitDisPersonTablePage } from '../pages/unit-dis-person-table/unit-dis-person-table';
import { ConfigProvider } from '../providers/config/config';
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
    UnitInterUnitPage,
    AdminHomePage,
    UserAddPage,
    UserUpdatePage,
    ModifyPasswordPage,
    UnitDisLeaderTablePage,
    UnitDisTablePage,
    UnitDistrictPage,
    UnitDisPersonTablePage
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
    UnitHcTableFrzPage,
    AdminHomePage,
    UserAddPage,
    UserUpdatePage,
    ModifyPasswordPage,
    UnitDisLeaderTablePage,
    UnitDisTablePage,
    UnitDistrictPage,
    UnitDisPersonTablePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    SqliteDbCopy,
    File,
    AndroidPermissions,
    FilePath,
    FileChooser,
    FileTransfer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    UserDatabaseProvider,
    StorageProvider,
    BabbUserProvider,
    BabbUnitProvider,
    TreeProvider,
    FileOpener,
    FileProvider,
    BabbDisProvider,
    ConfigProvider
  ]
})
export class AppModule {}
