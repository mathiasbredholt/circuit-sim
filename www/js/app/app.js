define(["jquery", "ui/commands"], function($, commands) {
  return {
    init: function() {
      console.log("APPLICATION INIT");

      $.get("json/library.json",
        function(data) {
          commands.load(data);
        }
      );
    }
  }
});
