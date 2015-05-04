console.log('Methods linked');
var $content = $('#content-container');
var methods = {
    // restaurants route 
    restaurants: function() {
        // Read all restaurants
        $content.empty();
        var $html = $(
            "<a data-action='newRestaurant' class='ui label blue'><i class='plus icon'></i> Add new restaurant</a><br/><br/><div class='ui special cards' data-attr='restaurants-cards'></div>"
        );
        $content.append($html);
        var restaurantsTemplate = $(
            'script[data-id="restaurants-template"]').text();
        var $restaurantsCards = $('div[data-attr="restaurants-cards"]');
        // Read all restaurants
        $.ajax({
            method: "GET",
            url: "/restaurants"
        }).done(function(restaurants) {
            var restaurantsEls = restaurants.map(function(
                restaurants) {
                return Mustache.render(
                    restaurantsTemplate,
                    restaurants);
            });
            $restaurantsCards.append(restaurantsEls);
/// IM STRUGGLING HERE !!!!!!!!!!!!!!!! RATINGS NEED TWO CLICKS
            $('.ui.rating').rating();
            $('.special.cards .image').dimmer({
                on: 'hover'
            });
/// IM STRUGGLING HERE MODALS DONT HAVE THE APROPIATE IDS 
            //modal to view menu 
            // var card = $( ".modal" ).parent(".card");
            // console.log(card)
            // var id = card.attr('data-id');
            // console.log(id)
            $('.standard.menu-items.modal') .modal('attach events', '.view-menu', 'show');

/// IM STRUGGLING HERE CATEGORIES ARENT BEING PERSISTED AND DONT HAVE THE APROPIATE IDS 
            // the select element for choosing a category
            var $catSelect = $(
                'select[data-action="getCategories"]');
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
                    var option = new Option(item.text,
                        item.id, true, true);
                    // Append it to the select
                    $catSelect.append(option);
                }
                // Update the selected options that are displayed
                $catSelect.trigger('change');
            });
        });
    },
    // categories route 
    categories: function() {
        $content.empty();
        var $html = $(
            "<a data-action='newCategory' class='ui label blue'><i class='plus icon'></i> Add new category</a><table class='ui table celled striped'><thead><th>Name</th><th>Description</th><th>Delete</th></thead><tbody data-attr='categories-table'></tbody></table>"
        );
        $content.append($html);
        var categoriesTemplate = $(
            'script[data-id="categories-template"]').text();
        var $categoriesTable = $('tbody[data-attr="categories-table"]');
        // Read all categories
        $.ajax({
            method: "GET",
            url: "/categories"
        }).done(function(categories) {
            var categoriesEls = categories.map(function(
                categories) {
                return Mustache.render(
                    categoriesTemplate, categories);
            });
            $categoriesTable.append(categoriesEls);
            $('.tabular.menu .item').tab();
        });
    },
    // menus route 
    menus: function() {
        $content.empty();
        var $html = $(
            "<a data-action='newMenuItem' class='ui label blue'><i class='plus icon'></i> Add new menu item</a><table class='ui table celled striped'><thead><th>Restaurant ID</th><th>Image</th><th>Name</th><th>Description</th><th>Price</th><th>Delete</th></thead><tbody data-attr='items-table'></tbody></table>"
        );
        $content.append($html);
        var menusTemplate = $('script[data-id="items-template"]').text();
        var $itemsTable = $('tbody[data-attr="items-table"]');
        // Read all menu items
        $.ajax({
            method: "GET",
            url: "/items"
        }).done(function(items) {
            var itemsEls = items.map(function(items) {
                return Mustache.render(menusTemplate,
                    items);
            });
            $itemsTable.append(itemsEls);
            $('.tabular.menu .item').tab();
        });
    },
    // about page 
    about: function() {
        $content.empty();
        var $html = $(
            "<h1>About Mesa</h1><h3> This is a website that contains information on restaurants in Costa Rica</h3><p>It is also a way to practice building one page web apps using jQuery. For example, this page was made using flatiron director.</p>"
        );
        $content.append($html);
    },
    // Prompts the user for an image URL and patches the restaurant image
    restaurantImageURL: function(id) {
        var image_url_input = prompt(
            "Please enter the image URL for this restaurant");
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
            });
        }
    },
    // Prompts the user for an image URL and patches the manu item image
    menuImageURL: function(id) {
        var image_url_input = prompt(
            "Please enter the image URL for this menu item");
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
            });
        }
    }
}; // end methods object