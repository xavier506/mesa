console.log('Router Linked');

///////////////////////
/// Director Routes //
/////////////////////  
var about = function() {
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