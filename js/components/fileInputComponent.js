class FileInputComponent {
  constructor(id) {
    this.input = document.getElementById(id);
    this.image = new Image();
    this.registerOnFileLoadEvent();
  }

  registerOnFileLoadEvent() {
    this.input.addEventListener('change', this.onFileLoad.bind(this));
  }

  registerOnFileReadyEvent(handler) {
    this.input.addEventListener('fileready', handler);
  }

  dispatchFileReadyEvent() {
    const event = new CustomEvent('fileready', { detail: this.image });
    this.input.dispatchEvent(event);
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
    if (this.input.files) {
      const file = this.input.files[0];
      this.createImageFromFile(file);
    }
  }
}