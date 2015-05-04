console.log('Router Linked');

///////////////////////
/// Director Routes //
/////////////////////  

var routes = {
    "/restaurants": methods.restaurants,
    "/menus": methods.menus,
    "/categories": methods.categories,
    "/about": methods.about
};

var router = Router(routes);
router.init();