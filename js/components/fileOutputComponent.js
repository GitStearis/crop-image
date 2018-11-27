export default class FileOutputComponent {
  constructor(id) {
    this.button = document.getElementById(id);
  }

  registerOnDownload(downloadHandler) {
    this.button.addEventListener('click', downloadHandler);
  }
}