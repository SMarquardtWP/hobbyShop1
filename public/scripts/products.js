'use strict';

function baseCall(url, mthd, successCallback, errorCallback, auth, body) {
    //sets up settings for call
    let settings = {
        method: mthd,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (body) {
        settings.body = JSON.stringify(body);
    }
    if (auth) {
        token = localStorage.getItem('token');
        settings.headers.Authorization = 'Bearer ' + token;
    }

    //makes fetch call
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => successCallback(responseJson))
        .catch(err => {
            errorCallback(err);
        });
}

/*name: { type: String, required: true },
tags: [{ type: String }],
price: { type: Number },
thumbnail: {type: String}*/

function displayProducts(productsJson){
    for (let i = 0; i<productsJson.length; i++){
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

function errorGetProducts(err){
    console.log(err);
}

// fix code for cases where some queries are blank
function watchSearch(){
    console.log('watchSearch is listening');
    $('.search').on('submit', function(event){
        event.preventDefault();
            console.log('You submitted the form');
        $('.productListing').empty();
            console.log('You are in the watchSearch');
        let queries='?';

        let name= $('input[name="pname"]').val();
            console.log(name);
        let tags= $('input[name="tags"]').val();
            console.log(tags);

        if (name !== "")
            queries += `name=${name}&`;

        if (tags !== "")
            queries += `tags=${tags}&`;


        console.log('Queries are '+ queries);
        getProducts(queries);
    });
}

function successLogin(responseJSON){
    $(".loginResponse").html(`You have logged in successfully`);
    localStorage.setItem("token", responseJSON.authToken);
}

function watchLogin(){
    $('.login').on('submit', function(event){
        event.preventDefault();
        let user = $('.username').val();
        let pass = $('.password').val();
        let url = './auth/login';

        let bodySettings = {
            username : user,
            password : pass
        }

        baseCall(url, 'POST', successLogin, errorLogin, false, bodySettings);
    });
}

function runProductsPage(){
    watchSearch();
    watchLogin();
    getProducts();
}

runProductsPage();