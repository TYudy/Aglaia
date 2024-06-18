/**
 * Define action to upload, drag & drop images or videos into canvas using Fabric.js
 */
(function () {
  var upload = function (canvas) {
    const _self = this;

    // Función para abrir el panel de arrastrar y soltar archivos multimedia.
    this.openDragDropPanel = function () {
      console.log('open drag drop panel');
      $('body').append(`<div class="custom-modal-container">
        <div class="custom-modal-content">
          <div class="drag-drop-input">
            <div>Drag & drop files<br>or click to browse.<br>JPG, PNG or SVG only!</div>
          </div>
        </div>
      </div>`);

      $('.custom-modal-container').click(function () {
        $(this).remove();
      });

      $('.drag-drop-input').click(function () {
        console.log('click drag drop');
        $(`${_self.containerSelector} #btn-media-upload`).click();
      });

      $(".drag-drop-input").on("dragover", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('dragging');
      });

      $(".drag-drop-input").on("dragleave", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragging');
      });

      $(".drag-drop-input").on("drop", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('dragging');
        if (event.originalEvent.dataTransfer) {
          if (event.originalEvent.dataTransfer.files.length) {
            let files = event.originalEvent.dataTransfer.files;
            processFiles(files);
            $('.custom-modal-container').remove();
          }
        }
      });
    };

    // Función para procesar los archivos multimedia (imágenes y videos).
    const processFiles = (files) => {
      if (files.length === 0) return;
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
      const allowedVideoTypes = ['video/mp4'];

      for (let file of files) {
        // Verificar el tipo de archivo permitido (imagen o video).
        if (allowedImageTypes.includes(file.type)) {
          processImage(file);
        } else if (allowedVideoTypes.includes(file.type)) {
          processVideo(file);
        }
      }
    };

    // Función para procesar archivos de imagen.
    const processImage = (file) => {
      let reader = new FileReader();

      reader.onload = (f) => {
        // Manejar archivo de imagen
        if (file.type === 'image/svg+xml') {
          fabric.loadSVGFromString(f.target.result, (objects, options) => {
            let obj = fabric.util.groupSVGElements(objects, options);
            obj.set({
              left: 0,
              top: 0
            }).setCoords();
            canvas.add(obj);
            canvas.renderAll();
          });
        } else {
          fabric.Image.fromURL(f.target.result, (img) => {
            img.set({
              left: 0,
              top: 0
            });
            img.scaleToHeight(300);
            img.scaleToWidth(300);
            canvas.add(img);
            canvas.renderAll();
          });
        }
      };

      if (file.type === 'image/svg+xml') {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    };

    // Función para procesar archivos de video.
    const processVideo = (file) => {
      let reader = new FileReader();

      reader.onload = function(event) {
        let blob = new Blob([event.target.result], { type: file.type });
        let url = URL.createObjectURL(blob);

        fabric.Image.fromURL(url, function(video) {
          video.set({
            left: 0,
            top: 0,
            scaleX: canvas.width / video.width,
            scaleY: canvas.height / video.height,
            selectable: true,
            evented: true,
            hasControls: true,
            originX: 'left',
            originY: 'top'
          });

          canvas.add(video);
          canvas.renderAll();
        }, { crossOrigin: 'anonymous' });
      };

      reader.readAsArrayBuffer(file);
    };

    // Añadir un input de tipo file para manejar la carga de archivos multimedia.
    this.containerEl.append(`<input id="btn-media-upload" type="file" accept="image/*,video/mp4" multiple hidden>`);
    document.querySelector(`${this.containerSelector} #btn-media-upload`).addEventListener('change', function (e) {
      if (e.target.files.length === 0) return;
      processFiles(e.target.files);
    });
  };

  // Extender el prototipo del objeto global 'ImageEditor' con la función 'upload'.
  window.ImageEditor.prototype.initializeUpload = upload;
})();
