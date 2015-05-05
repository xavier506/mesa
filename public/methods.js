console.log('Methods linked');
var $content = $('#content-container');
var methods = {
        // restaurants route modal
        restaurants: function() {
            // Read all restaurants
            $content.empty();
            var $html = "<a data-action='newRestaurant' class='ui label blue'><i class='plus icon'></i> Add new restaurant</a><br/><br/><div class='ui special cards' data-attr='restaurants-cards'></div>";
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

                $('.view-menu').on('click', function(e) {
                    var card = $(e.target).parents('.card');
                    var id = card.attr('data-id');

                    var $itemsHTML = "<a data-action='newMenuItem' class='ui label blue'><i class='plus icon'></i> Add new menu item</a><table class='ui table celled striped'><thead><th>Restaurant ID</th><th>Image</th><th>Name</th><th>Description</th><th>Price</th><th>Delete</th></thead><tbody data-attr='single-items-table'></tbody></table>";

                    card.find('.modal.long').modal('show');

                    $('.display-menu-items[data-id="' + id + '"]').append($itemsHTML);

                    var menusTemplate = $('script[data-id="items-template"]').text();
                    var $itemsTable = $('tbody[data-attr="single-items-table"]');
                    // Read all menu items
                    console.log(id);
                    $.ajax({
                        method: "GET",
                        url: "/items/?restaurant_id=" + id,
                        contentType: 'application/json'
                    }).done(function(items) {
                        console.log(items);
                        var itemsEls = items.map(function(items) {
                            return Mustache.render(menusTemplate,
                                items);
                        });
                        $itemsTable.append(itemsEls);
                    });

                });

                $('span[data-attr="category"]').on('click', function(e) {
                    var card = $(e.target).parents('.card');
                    var id = card.attr('data-id');

                    var $catSelect = $(
                        'select[data-action="getCategories"]');

                    $catSelect.dropdown();

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
                                item.text, false, false);
                            // Append it to the select
                            $catSelect.append(option);
                        }
                        // Update the selected options that are displayed
                        //$catSelect.trigger('change');
                    });
                    $('.modal.small.select-category[data-id="' + id + '"]').modal('setting', 'closable', false).modal('show');

                });
            });
    },
        // categories route 
        categories: function() {
            $content.empty();
            var $html = "<a data-action='newCategory' class='ui label blue'><i class='plus icon'></i> Add new category</a><table class='ui table celled striped'><thead><th>Name</th><th>Description</th><th>Delete</th></thead><tbody data-attr='categories-table'></tbody></table>";
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
            });
    },
    // menus route 
    menus: function() {
        $content.empty();
        var $html = "<a data-action='newMenuItem' class='ui label blue'><i class='plus icon'></i> Add new menu item</a><table class='ui table celled striped'><thead><th>Restaurant ID</th><th>Image</th><th>Name</th><th>Description</th><th>Price</th><th>Delete</th></thead><tbody data-attr='items-table'></tbody></table>";
        $content.append($html);
        var menusTemplate = $('script[data-id="items-template"]').text();
        var $itemsTable = $('tbody[data-attr="items-table"]');
        // Read all menu items
        $.ajax({
            method: "GET",
            url: "/items"
        }).done(function(items) {
          
//// THIS IS AN UNSOLVED ISSUE / FIND CORRESPONDING NAME FR EACH ID . ILL TRY USING LOADASH  OR UNDERSCORE LATER
          //console.log(items);

        //    $.ajax({
        //     method: "GET",
        //     url: "/restaurants/"
        // }).done(function(restaurants) {
        //   //console.log(restaurants)
        //    x = restaurants


        //   items.forEach(function(match,x){
        //     for (i=0; i<items.length; i++){

        //       if (match.restaurant_id === x[i].id){

        //         //console.log("hello " +x[i].name);

        //    console.log(x[0].id)

        //       }
        //     }
        //   })
        // })

            var itemsEls = items.map(function(items) {
                return Mustache.render(menusTemplate,
                    items);
            });
            $itemsTable.append(itemsEls);
        });

        // MAKE A DROPDOWN WITH THE RESTAURANTS TO PICK FROM AND ASSIGN TO EACH MENU ITEM
        var $restaurantsSelect = $("select[data-attr='restaurant-selector']");

                    $restaurantsSelect.dropdown();

                    var $getRestaurants = $.ajax({
                        method: "GET",
                        contentType: 'application/json',
                        url: '/restaurants' // get data for dropdown
                    });
                    $getRestaurants.then(function(data) {

                        // the data comes back as an array of data objects
                        for (var d = 0; d < data.length; d++) {
                            var item = data[d];
                            console.log(item.name);
                            console.log(item.id);
                            // Create the DOM option that is pre-selected by default
                            var option = new Option(item.name,
                                item.name, false, false);
                            // Append it to the select
                            $restaurantsSelect.append(option);
                        }
                        // Update the selected options that are displayed
                        //$catSelect.trigger('change');
                    });





    },
    // about page 
    about: function() {
        $content.empty();
        var $html = "<h1>About Mesa</h1><h3> This is a website that contains information on restaurants in Costa Rica</h3><p>It is also a way to practice building one page web apps using jQuery. For example, this page was made using flatiron director.</p>";
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
    },
    // Updates the category a restaurant belongs to
    updateCategory: function(id) {
      console.log("finalmente!")

    }
}; // end methods object