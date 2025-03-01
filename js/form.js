$(function () {
  function after_form_submitted(data) {
    console.log(data);
    if (data.result == "success") {
      $("form#reused_form").hide();
      $("#success_message").show();
      $("#error_message").hide();
    } else {
      $("#error_message").append("<ul></ul>");

      jQuery.each(data.errors, function (key, val) {
        $("#error_message ul").append("<li>" + key + ":" + val + "</li>");
      });
      $("#success_message").hide();
      $("#error_message").show();

      // Restore button state
      $('button[type="button"]', $form).each(function () {
        $btn = $(this);
        label = $btn.prop("orig_label");
        if (label) {
          $btn.prop("type", "submit");
          $btn.text(label);
          $btn.prop("orig_label", "");
        }
      });
    }
  }

  // Función para obtener una cookie por nombre
  function getCookie(name) {
    let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    if (match) return match[2];
  }

  // Función para establecer una cookie
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // Función para incrementar el contador de envíos
  function incrementFormSubmitCount() {
    let submitCount = getCookie("formSubmitCount") || 0;
    submitCount++;
    setCookie("formSubmitCount", submitCount, 1); // Expira en 1 día
    return submitCount;
  }

  $("#reused_form").submit(function (e) {
    e.preventDefault();
    // let submitCount = getCookie("formSubmitCount") || 0;

    // // Verifica si el usuario ha enviado el formulario más de dos veces
    // if (submitCount >= 2) {
    //   alert("Has alcanzado el límite de envíos de formularios.");
    //   return;
    // }

    // Incrementar el contador de envíos
    submitCount = incrementFormSubmitCount();

    $form = $(this);
    console.log($form.serialize());

    // Disable submit button
    $('button[type="submit"]', $form).each(function () {
      $btn = $(this);
      $btn.prop("type", "button");
      $btn.prop("orig_label", $btn.text());
      $btn.text("Sending ...");
    });

    // Execute reCAPTCHA
    $.ajax({
      type: "POST",
      url: "handler.php",
      data: $form.serialize(),
      success: after_form_submitted,
      dataType: "json",
    });
  });
});

// $(function()
// {
// 	$('#captcha_reload').on('click',function(e)
// 	{
// 	  e.preventDefault();
// 	  d = new Date();
// 	  var src = $("img#captcha_image").attr("src");
// 	  src = src.split(/[?#]/)[0];

// 	  $("img#captcha_image").attr("src", src+'?'+d.getTime());
// 	});
// });
