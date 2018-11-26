class CanvasComponent {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext('2d');
    this.image = new Image();
    this.initializeImage();
    this.registerDragEvents();

    this.isDragging = false;
    this.selectorRadius = 100;
    this.selectorX = this.canvas.width / 2;
    this.selectorY = this.canvas.height / 2;
  }

  registerDragEvents() {
    this.canvas.addEventListener('mousedown', this.grabSelector.bind(this));
    this.canvas.addEventListener('mousemove', this.moveSelector.bind(this));
    this.canvas.addEventListener('mouseup', this.releaseSelector.bind(this));
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

    this.width = this.canvas.width;
    this.height = this.width / ratio;

    if (this.height > this.canvas.height) {
      this.height = this.canvas.height;
      this.width = this.height * ratio;
    }

    this.offsetX = this.canvas.width / 2 - this.width / 2;
    this.offsetY = this.canvas.height / 2 - this.height / 2;

    this.redraw();
  }

  drawImage() {
    this.context.drawImage(this.image, this.offsetX, this.offsetY, this.width, this.height);
  }

  drawSelectionArea() {
    this.context.strokeStyle = '#212424';
    this.context.beginPath();
    this.context.setLineDash([5, 5]);
    this.context.arc(this.selectorX, this.selectorY, this.selectorRadius, 0, 2 * Math.PI, false);
    this.context.closePath();
    this.context.stroke();
  }

  redraw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); 
    this.drawImage();
    this.drawSelectionArea();
  }
}