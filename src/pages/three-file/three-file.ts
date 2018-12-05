import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { BabbUnitProvider } from '../../providers/babb-unit/babb-unit';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-three-file',
  templateUrl: 'three-file.html',
})
export class ThreeFilePage {

  fileList = [];
  unit: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public fileOpener: FileOpener,
    public babb: BabbUnitProvider,
    public config: ConfigProvider
  ) {
    this.unit = this.navParams.get('unit');
    console.log(this.unit);
    this.initData();
    console.log(this.config.DB_THREE_FILE_LOCATION)
  }

  initData() {
    this.babb.getThreeFile(this.unit.unitOid).then(
      res => {
        this.fileList = res;
      }
    );
  }

  getFileMimeType(fileType: string): string {
    let mimeType: string = '';

    switch (fileType) {
      case 'txt':
        mimeType = 'text/plain';
        break;
      case 'docx':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'doc':
        mimeType = 'application/msword';
        break;
      case 'pptx':
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'ppt':
        mimeType = 'application/vnd.ms-powerpoint';
        break;
      case 'xlsx':
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'xls':
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'zip':
        mimeType = 'application/x-zip-compressed';
        break;
      case 'rar':
        mimeType = 'application/octet-stream';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      default:
        mimeType = 'application/' + fileType;
        break;
    }
    return mimeType;
  }

  fileOpen(fileName) {
    // let fileFirst = 'fileDir';
    // let threeDir = 'threeDir';
    // let fileType = fileName.FILE_NAME.split('.')[1];
    let mineType = this.getFileMimeType(fileName.FILE_TYPE);
    this.fileOpener.open(this.config.DB_THREE_FILE_LOCATION + fileName.FILE_NAME, mineType).then(
      data => {
        console.log('open success')
      }
    ).catch(
      error => {
        console.log('open fail', this.file.dataDirectory + 'icon.png', error)
      }
    );
    // this.file.checkDir(this.file.externalRootDirectory, fileFirst).then(
    //   res => {
    //     this.file.checkDir(this.file.externalRootDirectory+fileFirst+'/', threeDir).then(
    //       res => {
    //         this.fileOpener.open(this.file.externalRootDirectory+fileFirst+'/'+threeDir+'/'+fileName.FILE_NAME, mineType).then(
    //           data => {
    //             console.log('open success')
    //           }
    //         ).catch(
    //           error => {
    //             console.log('open fail', this.file.dataDirectory + 'icon.png', error)
    //           }
    //         )
    //       }
    //     ).catch(
    //       res=>{
    //         alert('No Such Dirctory, contact the adminer');
    //         // this.file.createDir(this.file.externalRootDirectory+fileFirst, threeDir, false).then(

    //         // ).catch(res=>{
    //         //   console.log(res);
    //         // });
    //       }
    //     );
    //   }
    // ).catch(
    //   err => {
    //     alert('No Such dir, contact the adminer')
    //     this.file.createDir(this.file.externalRootDirectory, fileFirst, false);
    //   }
    // )
  }


  
  onClickHome() {
    this.navCtrl.popToRoot();
  }

}
