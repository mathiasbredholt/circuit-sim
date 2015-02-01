define(["jquery", "underscore", "components/component"], function($, _, Component) {
  var selectedIndex = 0;
  var numberOfItems = 0;
  
  function UpdateList(result) {
    numberOfItems = result.length;

    var results = $("#searchResult");
    results.empty();

    for (i = 0; i < result.length; i++) {
      var elem = $("<li>")
      .addClass("commandItem")
      .html(result[i].name)
      .mouseover(function() {
        selectedIndex = $(this).index();
        SelectItem(selectedIndex);
      });
      
      elem.append(
        $("<span>")
        .addClass("commandType")
        .html(result[i].type)
      );

      if (i == selectedIndex) {
        elem.addClass("hover");
      }

      results.append(elem);
    }
  }

  function SelectItem(index) {
    $("#searchResult li").removeClass("hover");
    $("#searchResult li:eq("+index+")").addClass("hover");
  }
  
  function SelectNextItem() {
    if (selectedIndex < numberOfItems - 1) {
      selectedIndex++;
    }
    else {
      selectedIndex = 0;
    }
    
    SelectItem(selectedIndex);
  }
  
  function SelectPrevItem() {
    if (selectedIndex > 0) {
      selectedIndex--;
    }
    else {
      selectedIndex = numberOfItems - 1;
    }
    
    SelectItem(selectedIndex);
  }

  return {
    init: function(socket) {
      var lastInput = "";
      
      socket.on("searchResult", function(data) {
        UpdateList(data);
      })
      
      $("#commandInput").keyup(function(e) {
        var input = $(this).val();
        if (input != lastInput) {
          lastInput = input;
//          UpdateList();
          socket.emit("search", input);
        }
        
      })

      $(document).keydown(function(e) {

        if (e.which == 32) {
          e.preventDefault();
          $("#commandInput")[0].blur();

          $("#rightmenu").toggleClass("slide");
//                     $("#rightmenu")[0].addEventListener('webkitTransitionEnd', function() {
//                       $("#commandInput")[0].focus();
//                     }, false);
        }

        var selected = $("#searchResult").find(".hover");

        if (e.which == 38) {
          e.preventDefault();
          SelectPrevItem();
        }

        if (e.which == 40) {
          e.preventDefault();
          SelectNextItem();
        }

        if (e.which == 13) {
          e.preventDefault();
          console.log(selected.html());
//          Component.create(_.find(library, { name: selected.html() }));
        }
      })

    }
  }
})
