define(["jquery"], function($) {
  return {
    load: function(library) {
        $("#commandInput").keyup(function() {
          var input = $(this).val();

          console.log(library);

        })
    }
  }
})
