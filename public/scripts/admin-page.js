
"use strict";


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
        let token = localStorage.getItem('hobbyToken');
        settings.headers.Authorization = 'Bearer ' + token;
    }

    console.log(settings);

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

function retrievalError(err){
    console.log(err);
}

/*----------------------------- USERS ------------------------*/

function watchUsers() {
    $('.userSearch').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.results').empty();

        let name = $('input[name="userName"]').val();
        console.log(name);
        let email = $('input[name="email"]').val();
        console.log(email);
        let auth = $('input[name="auth"').val();
        console.log(auth);

        let queries = '?';

        if (name !== "")
            queries += `username=${name}&`;
        if (email !== "")
            queries += `email=${email}&`;
        if (auth !== "")
            queries += `auth=${auth}&`;
        console.log(queries);

        getUsers(queries);
    });
}

function displayUsers(usersJson) {
    for (let i = 0; i < usersJson.length; i++) {

        $('.results').append(`
        <p>Name: ${usersJson[i].username}</p> <input type='text' name='editUName${i}' placeholder='New username here'>
        <p>Email:  ${usersJson[i].email}</p> <input type='text' name='editEmail${i}' placeholder='New email here'>
        <p>Authority: ${usersJson[i].authority}</p> <input type='text' name='editAuth${i}' placeholder='New authority here'></input>`)
    };
}

function getUsers(queries) {
    console.log('You are in the getUsers');
    let reqUrl = './users';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayUsers, retrievalError, true);
}

/*----------------------- PRODUCTS -------------------------*/

function displayProducts(productsJson) {
    for (let i = 0; i < productsJson.length; i++) {
        let tags = productsJson[i].tags;

        $('.results').append(`
        <div class='productEdit'>
            <p>Name: ${productsJson[i].name}</p> <input type='text' name='editPName${i}' placeholder='New name here'>
            <p>Tags:  ${tags.toString()}</p><input type='text' name='editTags${i}' placeholder='New tags here'>
            <p>Price: ${productsJson[i].price}</p><input type='text' name='editPrice${i}' placeholder='New price here'>
            <img src = "${productsJson[i].thumbnail}" alt = "Image of game"><input type='text' name='editThumbnail${i}' placeholder='New thumbnail here'>
        </div>`)
    };
}

function getProducts(queries) {
    console.log('You are in the getProducts');
    let reqUrl = './products';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayProducts, retrievalError, false);
}

function watchProducts() {
    $('.productSearch').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.results').empty();
        let queries = '?';

        let name = $('input[name="prodName"]').val();
        console.log(name);
        let tags = $('input[name="tags"]').val();
        console.log(tags);

        if (name !== "")
            queries += `name=${name}&`;
        if (tags !== "")
            queries += `tags=${tags}&`;

        console.log(queries);
        getProducts(queries);
    });
}

/*------------------------ EVENTS -----------------------*/

function watchEvents() {
    $('.eventSearch').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.results').empty();

        let name = $('input[name="pname"]').val();
        console.log(name);

        if (name !== "")
        queries += `name=${name}&`;
        console.log(queries);
        getEvents(queries);
    });
}

/*------------------------INITIALIZATION----------------*/

function watchSearches() {
    watchUsers();
    watchProducts();
    watchEvents();
    console.log('watchSearches is listening');
}

watchSearches();