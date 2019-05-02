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
genre: [{ type: String }],
tags: [{ type: String }],
price: { type: Number },
thumbnail: {type: String}*/

function displayProducts(productsJson){
    for (let i = 0; i<productsJson.length; i++){
        let genre = productsJson[i].genre;
        let tags = productsJson[i].tags;

        $('.productListing').append(`
        <p>Name: ${productsJson[i].name}</p>
        <p>Genres: ${genre.toString()}</p>
        <p>Tags:  ${tags.toString()}</p>
        <p>Price: ${productsJson[i].price}</p>
        <img src = "${productsJson[i].thumbnail}" alt = "Image of game">`)
    };
}

function getProducts(queries) {
    console.log('You are in the getProducts');
    let reqUrl = './../products/';
    if (queries)
    reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayProducts, errorGetProducts, false);
}

function errorGetProducts(err){
    console.log(err);
}

/* function postProduct() {
    let url = './products';
    let nme = 
    let gnre = 
    let tags =
    let price =
    let thumbnail =

    let bodySettings = {
        name: nme,
        genre: gnre,
        tags: tgs,
        price: prce,
        thumbnail: imglink
    }

    baseCall(url, 'POST', createSuccess, errorPostProducts, false, bodySettings);
}*/

function watchSearch(){
    console.log('watchSearch is listening');
    $('.search').on('submit', function(event){
        event.preventDefault();
            console.log('You submitted the form');
        $('.productListing').empty();
            console.log('You are in the watchSearch');
        let name= $('input[name="nameQuery"]').val();
            console.log(name);
        let genre= $('input[name="genreQuery"]').val();
            console.log(genre);
        let tags= $('input[name="tagsQuery"]').val();
            console.log(tags);
        let queries= `?name=${name}&genre=${genre}&tags=${tags}`;
            console.log(queries);
        getProducts(queries);
    });
}

function runProductsPage(){
    watchSearch();
    getProducts();
}

runProductsPage();