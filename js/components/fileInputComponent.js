export default class FileInputComponent {
  constructor(id) {
    this.button = document.getElementById(id);
    this.image = new Image();
    this.registerOnFileLoadEvent();
  }

  registerOnFileLoadEvent() {
    this.button.addEventListener('change', this.onFileLoad.bind(this));
  }

  registerOnFileReadyEvent(handler) {
    this.button.addEventListener('fileready', handler);
  }

  dispatchFileReadyEvent() {
    const event = new CustomEvent('fileready', { detail: this.image });
    this.button.dispatchEvent(event);
  }

  createImageFromFile(file) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (event) => {
      if (event.target.readyState == FileReader.DONE) {
        this.image.src = event.target.result;
        this.dispatchFileReadyEvent();
      }
    }
  }

  onFileLoad() {
    if (this.button.files) {
      const file = this.button.files[0];
      this.createImageFromFile(file);
    }
  }
}