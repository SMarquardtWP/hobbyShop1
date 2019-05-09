"use strict";

/*----------------------------- USERS ------------------------*/

function watchUsers() {
    $('.search').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.productListing').empty();
        console.log('You are in the watchSearch');
        let queries = '?';

        let name = $('input[name="pname"]').val();
        console.log(name);

        let email = $('input[name="email"]').val();
        console.log(email);

        let auth = $('input[name="auth"').val();
        console.log(auth);

        if (name !== "")
            queries += `name=${name}&`;

        if (email !== "")
            queries + `email=${email}&`;

        if (auth !== "")
            queries += `auth=${auth}&`;

        console.log(queries);
        getProducts(queries);
    });
}

/*----------------------- PRODUCTS -------------------------*/

function displayProducts(productsJson) {
    for (let i = 0; i < productsJson.length; i++) {
        let tags = productsJson[i].tags;

        $('.productListing').append(`
        <p>Name: ${productsJson[i].name}</p>
        <p>Tags:  ${tags.toString()}</p>
        <p>Price: ${productsJson[i].price}</p>
        <img src = "${productsJson[i].thumbnail}" alt = "Image of game">`)
    };
}



function getProducts(queries) {
    console.log('You are in the getProducts');
    let reqUrl = './products';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayProducts, errorGetProducts, false);
}

function watchProduct() {
    $('.search').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.productListing').empty();
        let queries = '?';

        let name = $('input[name="pname"]').val();
        console.log(name);
        let tags = $('input[name="tags"]').val();
        console.log(tags);

        if (name !== "")
            queries += `name=${name}&`;
        if (tags !== "")
            queries += `name=${tags}&`;

        console.log(queries);
        getProducts(queries);
    });
}

/*------------------------ EVENTS -----------------------*/

function watchEvents() {
    $('.search').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.productListing').empty();
        console.log('You are in the watchSearch');
        let name = $('input[name="pname"]').val();
        console.log(name);
        let tags = $('input[name="tags"]').val();
        console.log(tags);
        let queries = `?name=${name}&tags=${tags}`;
        console.log(queries);
        getProducts(queries);
    });
}

function watchSearches() {
    console.log('watchSearch is listening');
    watchUsers();
    watchProducts();
    watchEvents();
}

watchSearches();