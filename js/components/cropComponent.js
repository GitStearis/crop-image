class CropComponent {
  constructor(inputCanvasId, outputCanvasId) {
    this.inputCanvas = document.getElementById(inputCanvasId);
    this.outputCanvas = document.getElementById(outputCanvasId);
    this.inputContext = this.inputCanvas.getContext('2d');
    this.outputContext = this.outputCanvas.getContext('2d');

    this.image = new Image();
    
    this.isDragging = false;
    this.selectorRadius = 100;
    this.selectorX = this.inputCanvas.width / 2;
    this.selectorY = this.inputCanvas.height / 2;
    this.selectorData = new Image();
    this.selectorData.crossOrigin = 'Anonymous';

    this.initializeImage();
    this.registerDragEvents();
  }

  saveSelected() {
    const radius = this.selectorRadius - 2;
    this.selectorData = this.inputContext.getImageData(
      this.selectorX - radius, 
      this.selectorY - radius, 
      this.selectorX + radius, 
      this.selectorY + radius
    );
  }

  registerDragEvents() {
    this.inputCanvas.addEventListener('mousedown', this.grabSelector.bind(this));
    this.inputCanvas.addEventListener('mousemove', this.moveSelector.bind(this));
    this.inputCanvas.addEventListener('mouseup', this.releaseSelector.bind(this));
  }

  checkIfSelector(x, y) {
    const dx = this.selectorX - x;
    const dy = this.selectorY - y;
    return (dx * dx + dy * dy < this.selectorRadius * this.selectorRadius);
  }

  grabSelector(event) {
    if (!this.isDragging) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left; 
      const y = event.clientY - rect.top;
      this.dragStartX = x;
      this.dragStartY = y;
      if (this.checkIfSelector(x, y)) {
        this.isDragging = true;
      }
    }
  }

  moveSelector(event) {
    if (this.isDragging) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left; 
      const y = event.clientY - rect.top;
      const distanceX = x - this.dragStartX;
      const distanceY = y - this.dragStartY;
      this.selectorX +=  distanceX;
      this.selectorY += distanceY;
      this.redraw();
      this.dragStartX = x;
      this.dragStartY = y;
    }
  }

  releaseSelector(event) {
    if (this.isDragging) {
      const rect = event.target.getBoundingClientRect();
      this.releaseX = event.clientX - rect.left;
      this.releaseY = event.clientY - rect.top;

      this.isDragging = false;
    }
  }

  initializeImage(src) {
    this.image.onload = this.onImageLoad.bind(this);
    this.image.src = './student.jpg';
  }

  onImageLoad(event) {
    const ratio = this.image.width / this.image.height;

    this.width = this.inputCanvas.width;
    this.height = this.width / ratio;

    if (this.height > this.inputCanvas.height) {
      this.height = this.inputCanvas.height;
      this.width = this.height * ratio;
    }

    this.offsetX = this.inputCanvas.width / 2 - this.width / 2;
    this.offsetY = this.inputCanvas.height / 2 - this.height / 2;

    this.redraw();
  }

  drawImage() {
    this.inputContext.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height);
  }

  drawSelectionArea() {
    this.inputContext.strokeStyle = '#212424';
    this.inputContext.beginPath();
    this.inputContext.setLineDash([5, 5]);
    this.inputContext.arc(this.selectorX, this.selectorY, this.selectorRadius, 0, 2 * Math.PI, false);
    this.inputContext.closePath();
    this.inputContext.stroke();
  }

  drawCropped() {
    this.outputContext.putImageData(this.selectorData, 0, 0);
    this.outputContext.beginPath();
    this.outputContext.arc(this.outputCanvas.width / 2, this.outputCanvas.height / 2, this.selectorRadius, 0, 2 * Math.PI, false);
    this.outputContext.beginPath();
    this.outputContext.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height); 
    this.outputContext.restore();
  }

  clear() {
    this.outputContext.clearRect(0, 0, this.outputCanvas.width, this.outputCanvas.height); 
    this.inputContext.clearRect(0, 0, this.inputCanvas.width, this.inputCanvas.height); 
  }

  redraw() {
    this.clear();
    this.drawImage();
    this.drawSelectionArea();
    this.saveSelected();
    this.drawCropped();
  }
}