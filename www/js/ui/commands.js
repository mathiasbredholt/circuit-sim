define(["jquery", "components/component", "server/server"], function($, Component, Server) {
  var selectedIndex = 0, 
      numberOfItems = 0,
      result;
  
  function UpdateList() {
    numberOfItems = result.length;

    var results = $("#searchResult");
    results.empty();

    for (i = 0; i < numberOfItems; i++) {
      var elem = $("<li>")
      .addClass("commandItem")
      .html(result[i].name)
      .mouseover(function() {
        selectedIndex = $(this).index();
        SelectItem(selectedIndex);
      })
      .click(Select);
      
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
    
    if (selectedIndex > numberOfItems) {
      selectedIndex = numberOfItems - 1;
      SelectItem(selectedIndex);
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
  
  function Select() {
    Component.create(result[selectedIndex])
//    Component.create(_.find(library, { name: selected.html() }));
    
  }

  return {
    init: function() {
      var lastInput = "";
      
      Server.on("searchResult", function(data) {
        result = data;
        UpdateList();
      })
      
      $("#commandInput").keyup(function(e) {
        var input = $(this).val();
        if (input != lastInput) {
          lastInput = input;
//          UpdateList();
          Server.send("search", input);
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
          Select();
        }
      })

    }
  }
})
