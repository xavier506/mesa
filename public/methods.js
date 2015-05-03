console.log('Methods linked');

var methods = {

    // Prompts the user for an image URL and patches the restaurant image
    restaurantImageURL: function(id) {
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
    },

    // Prompts the user for an image URL and patches the manu item image
    menuImageURL: function(id) {
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
    
}; // end methods object