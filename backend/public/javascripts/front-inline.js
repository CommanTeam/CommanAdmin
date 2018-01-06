$(() => {
  var uploadFile = {};
  $('#fileInput').on('change', function (event) {
    console.log("on file changed");
    handleDrop(event.target.files[0], 300, 200);
  });

  $('#submitBtn').click(() => {
    console.log("on click");
    var fd = new FormData();
    fd.append("name", $('#nameInput').val());
    fd.append("image", uploadFile);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://loacalhost:3000/register_instructor");
    xhr.send(fd);
  });

  function handleDrop(file, widthSize, heightSize) {
    var img = document.createElement("img");
    img.src = window.URL.createObjectURL(file);
    var canvas = document.getElementById("prevCanvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = widthSize;
    var MAX_HEIGHT = heightSize;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    console.log(canvas);
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    uploadFile = canvas.mozGetAsFile(file.name);

  }
});