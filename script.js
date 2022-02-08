$("#form").on("submit", e => {
  e.preventDefault();

  const file_list = $("#file").prop("files");
  if (_.isEmpty(file_list)) {
    console.error("Image File is empty");
    return;
  }
  const file = file_list[0];
  if (file.type.indexOf("image") === -1) {
    console.error("file is not an image");
    return;
  }

  let status = {};
  Tesseract.recognize(
  file,
  {
    lang: 'eng',
    tessedit_write_images: 'true' }).


  progress(result => {
    let p = result.progress * 100;
    if (!status[result.status]) {
      status[result.status] = true;
      $("#progress").append(`
          <p>${result.status}</p>
          <div class="progress">
            <div class="progress-bar progress-bar${_.size(status)}"></div>
          <div>
        `);
    }
    if (_.isNaN(p)) {
      p = 100;
    }
    $(`.progress-bar${_.size(status)}`).
    css({ width: `${p}%` }).
    text(parseFloat(p).toFixed(2));
  }).
  catch(err => {
    $(".progress-bar").addClass("progress-bar-error");
    console.log("Error in competing Tesserect job :: ", err);
  }).
  then(result => {
    $(".progress-bar").addClass("progress-bar-success");
    $("#result").text(result.text);
    console.dir(result);
  });
});