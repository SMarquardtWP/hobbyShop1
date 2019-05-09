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

/* function postProduct() {
    let url = './products';
    let nme =  
    let tags =
    let price =
    let thumbnail =

    let bodySettings = {
        name: nme,
        tags: tgs,
        price: prce,
        thumbnail: imglink
    }

    baseCall(url, 'POST', createSuccess, errorPostProducts, false, bodySettings);
}*/


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

function runProductsPage(){
    watchSearch();
    getProducts();
}

runProductsPage();