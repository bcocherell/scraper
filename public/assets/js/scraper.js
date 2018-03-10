$(document).on("click", ".addCommentBtn", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to create a comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      comment: $("#postComment").val()
    }
  })
    .then(function(data) {
      // Log the response
      console.log(data);
    });

  // Also, remove the values entered in the input
  $("#postComment").val("");
});

$(document).on("click", ".deleteCommentBtn", function() {
  // Grab the id associated with the comment from the submit button
  var thisId = $(this).attr("data-id");

  // Run a DELETE request to delete the comment
  $.ajax({
    method: "DELETE",
    url: "/comments/" + thisId
  })
    .then(function(data) {
      // Log the response
      console.log(data);
    });
});

$(document).on("click", ".commentBtn", function() {
  // Empty the comments from the comment section
  $("#modalCommentContainer").empty();
  // Save the id from the button
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the comment information to the page
    .then(function(data) {
      console.log(data);
      
      var modalCommentContainer = $("#modalCommentContainer");

      modalCommentContainer.append('<h4>' + data.title + '</h4>');

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
      
    $(".jumbotron").after('<div class="alert alert-success" role="alert">scraping successful</div>');
    setTimeout(function () {
      location.reload();
    }, 5000);
  });
});