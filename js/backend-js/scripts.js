$(function () {
  var custom_uploader;
  $('.gallery-wrapper').on('click', function (e) {
    e.preventDefault();

    if (custom_uploader) {
      custom_uploader.open();
      return;
    }


    var button = $(this),
      custom_uploader = wp.media.frames.file_frame = wp.media({
        frame: 'select',
        title: 'Insert image',
        multiple: 'add', // for multiple image selection set to true
        button: {
          text: 'Use this image' // button label text
        },
      });
    var html = "";
    var vals = "";
    custom_uploader.open();

    custom_uploader.on('select', function () { // it also has "open" and "close" events
      var selection = custom_uploader.state().get('selection');
      var map = selection.map(function (attachment) {
        attachment = attachment.toJSON();

        // $("button").after("<img src=" +attachment.url+">");

        $('.remove_image_button').show();
        html += "<div class=\"admin-image-wrapper\"><img src=" + attachment.url + "></div>";
        vals += "," + attachment.id;

      });
      vals = vals.slice(1);
      html += "<input type='hidden' name='image_libary_images' id='image_libary_images' value='" + vals + "' />";
      $(button).html(html);

    });
  });

  /*
   * Remove image event
   */
  $('body').on('click', '.remove_image_button', function () {
    $(this).siblings('.gallery-wrapper').html('<input type="hidden" name="image_libary_images" id="image_libary_images" value="null" /><div class="upload">Upload Image</div>');
    $('.remove_image_button').hide();

    return false;
  });
});