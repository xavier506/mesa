console.log('App linked');

///////////////////////
/// CRUD Restaurants//
/////////////////////  
var restaurantsTemplate = $('script[data-id="restaurants-template"]').text();
var $restaurantsCards = $('div[data-attr="restaurants-cards"]');

// Create a new restaurant
$('a[data-action="newRestaurant"]').on('click', function() {

    var blankRestaurant = {
        name: "new restaurant title",
        image_url: "http://warrentruckandtrailerinc.com/files/2014/07/placeholder.png",
        location: "Costa Rica",
        description: "Enter description here... Bacon ipsum dolor amet sirloin ham prosciutto pork rump pastrami. Strip steak jowl biltong jerky porchetta shank pastrami cow pancetta corned beef pork chop. Cow alcatra swine beef pork belly sirloin. Sirloin shankle chicken brisket, filet mignon shank corned beef.",
        rating: 0,
        rating_count: 0
    };

    $.ajax({
        method: "POST",
        url: "/restaurants",
        data: JSON.stringify(blankRestaurant),
        contentType: 'application/json'
    }).done(function(data) {
        var html = Mustache.render(restaurantsTemplate, data);

        $restaurantsCards.prepend(html);
    });
});

// Read all restaurants
$.ajax({
    method: "GET",
    url: "/restaurants"
}).done(function(restaurants) {

    var restaurantsEls = restaurants.map(function(restaurants) {
        return Mustache.render(restaurantsTemplate, restaurants);
    });

    $restaurantsCards.append(restaurantsEls);

    $('.ui.rating').rating();

    $('.tabular.menu .item').tab();

    $('.special.cards .image').dimmer({
            on: 'hover'
    });

    // the select element for choosing a category
    var $catSelect = $('select[data-action="getCategories"]');

    $catSelect.select2({
        placeholder: "Select a category"
    });

    // Select dropdown data for categories
    var $getCategories = $.ajax({
        method: "GET",
        contentType: 'application/json',
        url: '/categories' // get data for dropdown
    });

    $getCategories.then(function(data) {
        // the data comes back as an array of data objects
        for (var d = 0; d < data.length; d++) {
            var item = data[d];

            // Create the DOM option that is pre-selected by default
            var option = new Option(item.text, item.id, true, true);

            // Append it to the select
            $catSelect.append(option);
        }

        // Update the selected options that are displayed
        $catSelect.trigger('change');
    });
});

// Update a restaurant 
$restaurantsCards.on('blur', '[contenteditable="true"]', function(e) {
    var card = $(e.target).parents('.card');
    var id = card.attr('data-id');
    console.log(id)

    var name = card.find('[data-attr="name"]').text();
    var description = card.find('[data-attr="description"]').text();
    var location = card.find('[data-attr="location"]').text();

    var payload = JSON.stringify({
        name: name,
        description: description,
        location: location,
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

// Update restaurant category
$restaurantsCards.on('change', 'select[data-attr="category"]', function(e) {
    var card = $(e.target).parents('.card');
    var id = card.attr('data-id');

    var category = card.find('[data-attr="category"]').val();

    console.log("category " + category);
    console.log("card " + card);
    console.log("id " + id);

    var payload = JSON.stringify({
        category: category
    });

    $.ajax({
        method: "PATCH",
        url: "/restaurants/" + id,
        data: payload,
        contentType: 'application/json'
    }).done(function() {
        //alert('Saved! category'+payload); // make a nice alert div that can be dismmissed 
    });
});

// Update restaurant ratings
$restaurantsCards.on('click', '[data-attr="rating"]', function(e) {
    var card = $(e.target).parents('.card');
    var id = card.attr('data-id');
    var rating_count;

    $.ajax({
        method: "GET",
        url: "/restaurants/" + id
    }).done(function(restaurant) {
        rating_count = restaurant.rating_count;
    });

    $('.ui.rating')
        .rating('setting','onRate', function(rating) {

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

// Delete a restaurant
$restaurantsCards.on('click', '[data-action="delete"]', function(e) {
    var card = $(e.target).parents('.card');
    var id = card.attr('data-id');

    $.ajax({
        method: "DELETE",
        url: '/restaurants/' + id
    }).done(function() {
        card.remove();
    });
});

///////////////////////
/// CRUD Categories//
/////////////////////  
var categoriesTemplate = $('script[data-id="categories-template"]').text();
var $categoriesTable = $('tbody[data-attr="categories-table"]');

// Create a new category
$('a[data-action="newCategory"]').on('click', function() {
    $.ajax({
        method: "POST",
        url: "/categories",
        data: JSON.stringify({
            text: "new category",
            description: "category description",
        }),
        contentType: 'application/json'
    }).done(function(data) {
        var html = Mustache.render(categoriesTemplate, data);

        $categoriesTable.prepend(html);
    });
});

// Read all categories
$.ajax({
    method: "GET",
    url: "/categories"
}).done(function(categories) {

    var categoriesEls = categories.map(function(categories) {
        return Mustache.render(categoriesTemplate, categories);
    });

    $categoriesTable.append(categoriesEls);

    $('.tabular.menu .item').tab();

});

// Update a category
$categoriesTable.on('blur', '[contenteditable="true"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    var text = row.find('[data-attr="text"]').text();
    var description = row.find('[data-attr="description"]').text();

    var payload = JSON.stringify({
        text: text,
        description: description,
    });

    $.ajax({
        method: "PUT",
        url: "/categories/" + id,
        data: payload,
        contentType: 'application/json'
    }).done(function() {
        // alert('Saved!'); // make a nice alert div that can be dismmissed 
    });
});

// Delete a category
$categoriesTable.on('click', '[data-action="delete"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    $.ajax({
        method: "DELETE",
        url: '/categories/' + id
    }).done(function() {
        row.remove();
    });
});

///////////////////////
/// CRUD Menu Items //
/////////////////////  
var menusTemplate = $('script[data-id="items-template"]').text();
var $itemsTable = $('tbody[data-attr="items-table"]');

// Create a new category
$('a[data-action="newMenuItem"]').on('click', function() {
    $.ajax({
        method: "POST",
        url: "/items",
        data: JSON.stringify({
            text: "new menu item",
            description: "item description",
        }),
        contentType: 'application/json'
    }).done(function(data) {
        var html = Mustache.render(menusTemplate, data);

        $itemsTable.prepend(html);
    });
});

// Read all menu items
$.ajax({
    method: "GET",
    url: "/items"
}).done(function(items) {

    var itemsEls = items.map(function(items) {
        return Mustache.render(menusTemplate, items);
    });

    $itemsTable.append(itemsEls);

    $('.tabular.menu .item').tab();

});

// Update a menu item
$itemsTable.on('blur', '[contenteditable="true"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    var name = row.find('[data-attr="name"]').text();
    var description = row.find('[data-attr="description"]').text();
    var price = row.find('[data-attr="price"]').text();

    var payload = JSON.stringify({
        name: name,
        description: description,
        price: price
    });

    $.ajax({
        method: "PUT",
        url: "/items/" + id,
        data: payload,
        contentType: 'application/json'
    }).done(function() {
        // alert('Saved!'); // make a nice alert div that can be dismmissed 
    });
});

// Delete a menu item
$itemsTable.on('click', '[data-action="delete"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    $.ajax({
        method: "DELETE",
        url: '/items/' + id
    }).done(function() {
        row.remove();
    });
});