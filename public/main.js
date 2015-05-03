console.log('linked');

///////////////////////
/// Director Routes //
/////////////////////  
var about = function (){
    var $content = $('#content-container');
    $content.empty();

    var $html = $("<h1>About Mesa</h1><h3> This is a website that contains information on restaurants in Costa Rica</h3><p>It is also a way to practice building one page web apps using jQuery. For example, this page was made using flatiron director.</p>");

    $content.append($html);
};

var routes = {
    "/about": about
};

var router = Router(routes);
router.init();   


///////////////////////
/// CRUD Restaurants//
/////////////////////  
var restaurantsTemplate = $('script[data-id="restaurants-template"]').text();
var $restaurantsTable = $('tbody[data-attr="restaurants-table"]');

// Create a new restaurant
$('a[data-action="newRestaurant"]').on('click', function() {
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
        var html = Mustache.render(restaurantsTemplate, data);

        $restaurantsTable.prepend(html);
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

    $restaurantsTable.append(restaurantsEls);

    $('.ui.rating').rating();

    $('.tabular.menu .item').tab();

    // the select element for choosing a category
    var $catSelect = $('select[data-action="getCategories"]')

     $catSelect.select2({
         placeholder: "Select a category"
     }); 

    // Select dropdown data for categories
    var $getCategories = $.ajax({
      method: "GET",
      contentType: 'application/json',  
      url: '/categories' // wherever your data is actually coming from
    });

    $getCategories.then(function (data) {
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
$restaurantsTable.on('blur','[contenteditable="true"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    var name = row.find('[data-attr="name"]').text();
    var description = row.find('[data-attr="description"]').text();
    var location = row.find('[data-attr="location"]').text();

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
$restaurantsTable.on('change','select[data-attr="category"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');
    
    var category = row.find('[data-attr="category"]').val();

    console.log("category " +category);
    console.log("row " +row);
    console.log("id " +id);

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
$restaurantsTable.on('click','[data-attr="rating"]', function(e) {
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

function restaurantImageURL(id) {
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
$restaurantsTable.on('click', '[data-action="delete"]', function(e) {
    var row = $(e.target).parents('tr');
    var id = row.attr('data-id');

    $.ajax({
        method: "DELETE",
        url: '/restaurants/' + id
    }).done(function() {
        row.remove();
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

function menuImageURL(id) {
    var image_url_input = prompt("Please enter the image URL for this menu item");

    if (image_url_input !== null) {

        var payload = JSON.stringify({
            image_url: image_url_input
        });

        $.ajax({
            method: "PATCH",
            url: "/items/" + id,
            data: payload,
            contentType: 'application/json'
        }).done(function() {
            // alert('Saved Image URL!'); // make a nice alert div that can be dismmissed 
            location.reload();
        });
    }
}

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