class ApplicationController {
  constructor() {
    this.cropper = new CropComponent('input-canvas', 'output-canvas');
    this.fileInput = new FileInputComponent('input-button');

    this.fileInput.registerOnFileReadyEvent(this.cropper.onImageChange.bind(this.cropper));
  }
}