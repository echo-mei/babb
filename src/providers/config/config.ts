import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class ConfigProvider {

  DB_NAME = 'BA_DATA.db';
  DB_LOCATION = 'default';
  // pad中存放db文件的地址
  DB_FILE_LOCATION: string;
  // pad中存放db文件的名称
  DB_FILE_NAME = 'BA_DATA.db';
  // 三定文件存放地址
  DB_THREE_FILE_LOCATION: string;
  // 历史沿革文件存放地址
  DB_HISTORY_FILE_LOCATION: string;

  constructor(
    public file: File
  ) {
    this.DB_FILE_LOCATION = this.file.externalRootDirectory + 'babb/datadbfile/';
    this.DB_FILE_NAME = 'BA_DATA.db';
    this.DB_THREE_FILE_LOCATION = this.file.externalRootDirectory + 'babb/sdfile/';
    this.DB_HISTORY_FILE_LOCATION = this.file.externalRootDirectory + 'babb/orginstfile/';
  }

}
