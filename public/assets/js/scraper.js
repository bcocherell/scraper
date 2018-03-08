$(document).on("click", ".addCommentBtn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      comment: $("#postComment").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#postComment").val("");
});

$(document).on("click", ".commentBtn", function() {
  // Empty the notes from the note section
  $("#modalCommentContainer").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      
      var modalCommentContainer = $("#modalCommentContainer");

      modalCommentContainer.append('<h3>' + data.title + '</h3>');

      for (var i = 0; i < data.comments.length; i++) {
        var panel = $('<div class="panel panel-default">');
        var panelbody = $('<div class="panel-body">').text(data.comments[i].comment);
        panelbody.append('<button data-id="' + data.comments[i]._id + '" type="submit" class="btn btn-danger deleteCommentBtn" data-dismiss="modal" style="float: right;">delete</button>')
        panel.append(panelbody);
        modalCommentContainer.append(panel);
      }

      form = $('<form>');
      form.append('<div class="form-group"><label for="postComment">comment:</label><input type="text" class="form-control" id="postComment" required></div>');
      form.append('<div class="text-right form-group"><button data-id="' + data._id + '" type="submit" class="btn btn-primary addCommentBtn" data-dismiss="modal">add comment</button></div>')

      modalCommentContainer.append(form);
    });
});

$(document).on("click", "#scrapeBtn", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function(data) {
      
    // $(".jumbotron").after('<div class="alert alert-success" role="alert">' + data + '</div>');
    $(".jumbotron").after('<div class="alert alert-success" role="alert">scraping successful</div>');
    setTimeout(function () {
      location.reload();
    }, 2000);
  });
});