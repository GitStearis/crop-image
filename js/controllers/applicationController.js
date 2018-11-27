import CropComponent from '../components/cropComponent.js';
import FileInputComponent from '../components/fileInputComponent.js';
import FileOutputComponent from '../components/fileOutputComponent.js';

export default class ApplicationController {
  constructor() {
    this.cropper = new CropComponent('input-canvas', 'output-canvas');
    this.fileInput = new FileInputComponent('input-button');
    this.fileOutput = new FileOutputComponent('output-button');

    this.fileInput.registerOnFileReadyEvent(this.cropper.onImageChange.bind(this.cropper));
    this.fileOutput.registerOnDownload(this.downloadCroppedImage.bind(this));
  }

  downloadCroppedImage() {
    const image = this.cropper.outputCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    this.fileOutput.button.setAttribute('download', `cropped-${new Date().getTime()}.png`);
    this.fileOutput.button.setAttribute('href', image);
  }
}