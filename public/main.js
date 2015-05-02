console.log('linked');

///////////////////////
/// CRUD Restaurants//
/////////////////////  
var template = $('script[data-id="template"]').text();

// Create a new restaurant
$('.ui.label.blue').on('click', function() {
    $.ajax({
        method: "POST",
        url: "/restaurants",
        data: JSON.stringify({
            name: "new restaurant",
            image_url: "http://warrentruckandtrailerinc.com/files/2014/07/placeholder.png",
            rating: 0,
            rating_count: 0
        }),
        contentType: 'application/json'
    }).done(function(data) {
        var html = Mustache.render(template, data);

        $('tbody').prepend(html);
    });
});

// Read all restaurants
$.ajax({
    method: "GET",
    url: "/restaurants"
}).done(function(restaurants) {

    var restaurantsEls = restaurants.map(function(restaurants) {

        return Mustache.render(template, restaurants);
    });

    $('tbody').append(restaurantsEls);

    $('.ui.rating')
        .rating();

});

// Update a restaurant 
$('tbody').on('blur', '[contenteditable="true"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    var name = row.find('[data-attr="name"]').text();
    var description = row.find('[data-attr="description"]').text();
    var location = row.find('[data-attr="location"]').text();
    var category = row.find('[data-attr="category"]').text();

    var payload = JSON.stringify({
        name: name,
        description: description,
        location: location,
        category: category,
    });

    $.ajax({
        method: "PUT",
        url: "/restaurants/" + id,
        data: payload,
        contentType: 'application/json'
    }).done(function() {
        // alert('Saved!'); // make a nice alert div that can be dismmissed 
    });
});

// Update restaurant ratings
$('tbody').on('click', '[data-attr="rating"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');
    var rating_count;

    $.ajax({
        method: "GET",
        url: "/restaurants/" + id
    }).done(function(restaurant) {
        rating_count = restaurant.rating_count;
    });

    $('.ui.rating')
        .rating('setting', 'onRate', function(rating) {

            console.log("restaurant rated " + rating);

            rating_count++;

            var payload = JSON.stringify({
                rating: rating,
                rating_count: rating_count
            });

            $.ajax({
                method: "PATCH",
                url: "/restaurants/" + id,
                data: payload,
                contentType: 'application/json'
            }).done(function() {
                //alert('Saved rating!'); // make a nice alert div that can be dismmissed 
                location.reload();
            });
        });
});


function getImageURL(id) {
    var image_url_input = prompt("Please enter the image URL for this restaurant");

    if (image_url_input !== null) {

        var payload = JSON.stringify({
            image_url: image_url_input
        });

        $.ajax({
            method: "PATCH",
            url: "/restaurants/" + id,
            data: payload,
            contentType: 'application/json'
        }).done(function() {
            // alert('Saved Image URL!'); // make a nice alert div that can be dismmissed 
            location.reload();
        });
    }
}

// Delete a restaurant
$('tbody').on('click', '[data-action="delete"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    $.ajax({
        method: "DELETE",
        url: '/restaurants/' + id
    }).done(function() {
        row.remove();
    });
});