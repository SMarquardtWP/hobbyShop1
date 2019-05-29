
"use strict";

const RESULTS = {
    ids: [],
    emptyIds: function () {
        this.ids.length = 0;
    }
};


function baseCall(url, mthd, successCallback, errorCallback, auth, body) {
    //sets up settings for call
    console.log(body);
    let settings = {
        method: mthd,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (body) {
        settings.body = JSON.stringify(body);
    }
    console.log(body);
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

function errorFetch(err) {
    console.log(err);
}

/*----------------------------- USERS ------------------------*/

function watchUsersGET() {
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

function watchUsersPOST() {
    console.log('watching for POSTS in users');
    $('.blankFields').on('click', '#userCreate', function (event) {
        event.preventDefault();

        console.log('Heard POST request');

        $('.required').each(function () {
            if ($(this).val().length == 0) {
                $('.postError').html('<p>Please fill in all required fields.</p>');
                return;
            }
        });

        let body = {};

        let reqUrl = './products';
        body.username = $('.blankFields').find('input[name="userName"]').val();
        console.log(body.name);
        body.email = $('.blankFields').find('input[name="email"]').val();
        body.auth = $('.blankFields').find('input[name="auth"]').val();

        console.log(body);

        baseCall(reqUrl, 'POST', displayPost, errorFetch, true, body);
    })
}

function watchUsersUpdate() {
    $('.results').on('click', '.userClick', function (event) {
        event.preventDefault();

        let index = $(event.currentTarget).parent().attr('id');
        let method = event.currentTarget.value;
        console.log('index', index);
        let reqUrl = `./users/admin/${RESULTS.ids[index]._id}`;
        let newUsername;
        let newEmail;
        let newAuthority;
        let body = {};

        if ($(`input[name="editUName${index}"]`).val()) {
            newUsername = $(`input[name="editUName${index}"]`).val();
            body.username = newUsername;
        }
        if ($(`input[name="editEmail${index}"]`).val()) {
            newEmail = $(`input[name="editEmail${index}"]`).val();
            body.email = newEmail;
        }
        if ($(`input[name="editAuthority${index}"]`).val()) {
            newAuthority = $(`input[name="editAuthority${index}"]`).val();
            body.authority = newAuthority;
        }

        console.log(body);

        if (method == 'Update') {
            baseCall(reqUrl, 'PUT', displayUserUpdate, errorFetch, true, body);
        }

        if (method == 'Delete') {
            baseCall(reqUrl, 'DELETE', displayUserUpdate, errorFetch, true);
        }
    });
}

function displayUsers(productsJson) {
    console.log('In displayUsers');
    RESULTS.emptyIds();
    RESULTS.ids = productsJson;
    for (let i = 0; i < RESULTS.ids.length; i++) {
        usersPrint(RESULTS.ids[i], i);
    };
    console.log(RESULTS.ids);
}

function usersPrint(user, i) {
    $('.results').append(`
    <form class='userEdit' id='${i}'>
        <p>Name: ${user.username}</p> <input type='text' name='editUName${i}' placeholder='New name here'>
        <p>Email: ${user.email}</p><input type='text' name='editEmail${i}' placeholder='New price here'>
        <p>Authority: ${user.authority}</p><input type='text' name='editAuthority${i}' placeholder='New auth: 1-3'>
        <input type='submit' class='userClick' value='Update'>
        <input type='submit' class='userClick' value='Delete'>
    </form>`)
}



function getUsers(queries) {
    console.log('You are in the getUsers');
    let reqUrl = './users';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayUsers, errorFetch, true);
}

function displayUserUpdate(userJson) {
    console.log('Displaying Your User Update');
    console.log(userJson);
    $('.results').empty();
    for (let i = 0; i < RESULTS.ids.length; i++) {
        if (userJson._id == RESULTS.ids[i]._id) {
            if (userJson.status == "DELETE") {
                let removed = RESULTS.ids.splice(i, 1);
                i++;
            }
            else
                RESULTS.ids[i] = userJson;
        }
        usersPrint(RESULTS.ids[i], i);
    }
}

/*----------------------- PRODUCTS -------------------------*/

function watchProductsGET() {
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

function watchProductsPOST() {
    console.log('watching for POSTS in products');
    $('.blankFields').on('click', '#productCreate', function (event) {
        event.preventDefault();

        console.log('Heard POST request');

        $('.required').each(function () {
            if ($(this).val() == 0) {
                displayPost('Please fill in all required fields');
                throw new Error("Missing required fields");
            }
        });

        let body = {};

        let reqUrl = './products';
        body.name = $('.blankFields').find('input[name="prodName"]').val();
        console.log(body.name);
        body.tags = $('.blankFields').find('input[name="tags"]').val();
        body.price = $('.blankFields').find('input[name="price"]').val();
        body.thumbnail = $('.blankFields').find('input[name="thumbnail"]').val();

        console.log(body);

        baseCall(reqUrl, 'POST', displayPost, errorFetch, true, body);
    })
}

/*          
<label for=prodName>Name: </label>
<input type='text' name='prodName' class='required' placeholder='product name'>
<label for=tags>Tags: </label>
<input type='text' name='tags' class='required' placeholder='card, dice, e.g.'>
<label for=price>Price: $</label>
<input type='text' name='price' class='required' placeholder='price'>
<label for=thumbnail>Thumbnail Image Link: </label>
<input type='text' name='thumbnail' class='required' placeholder='photoplace.com/img e.g.'>
<input type='submit' id='productCreate' value='Submit'> 
*/

function watchProductsUpdate() {
    console.log('watching for updates');
    $('.results').on('click', '.productClick', function (event) {
        event.preventDefault();

        let index = $(event.currentTarget).parent().attr('id');
        let method = event.currentTarget.value;
        console.log('index', index);
        let reqUrl = `./products/${RESULTS.ids[index]._id}`;
        let newName;
        let newTags;
        let newPrice;
        let newThumbnail;
        let body = {};

        if ($(`input[name="editPName${index}"]`).val() != '') {
            newName = $(`input[name="editPName${index}"]`).val();
            body.name = newName;
        }
        if ($(`input[name="editTags${index}"]`).val() != '') {
            newTags = $(`input[name="editTags${index}"]`).val();
            body.tags = newTags;
        }
        if ($(`input[name="editPrice${index}"]`).val() != '') {
            newPrice = $(`input[name="editPrice${index}"]`).val();
            body.price = newPrice;
        }
        if ($(`input[name="editThumbnail${index}"]`).val() != '') {
            newThumbnail = $(`input[name="editThumbnail${index}"]`).val();
            body.thumbnail = newThumbnail;
        }

        console.log(body);

        if (method == 'Update') {
            baseCall(reqUrl, 'PUT', displayProductUpdate, errorFetch, true, body);
        }

        if (method == 'Delete') {
            baseCall(reqUrl, 'DELETE', displayProductUpdate, errorFetch, true);
        }
    });
}

function getProducts(queries) {
    console.log('You are in the getProducts');
    let reqUrl = './products';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayProducts, errorFetch, true);
}

function displayProducts(productsJson) {
    RESULTS.emptyIds();
    RESULTS.ids = productsJson;
    for (let i = 0; i < RESULTS.ids.length; i++) {
        productPrint(RESULTS.ids[i], i);
    };
    console.log(RESULTS.ids);
}

function displayPost(message) {
    $('.postOutcome').css("display", "inline-block");
    if (message)
        $('.postOutcome').html(`<p>${message}</p>`);
    else
        $('.postOutcome').html(`<p>Successfully created new item.</p>`);
    $('.postOutcome').fadeOut(2000);
}

function displayProductUpdate(productJson) {
    console.log('Displaying Your Update');
    console.log(productJson);
    $('.results').empty();
    for (let i = 0; i < RESULTS.ids.length; i++) {
        if (productJson._id == RESULTS.ids[i]._id) {
            if (productJson.status == "DELETE") {
                let removed = RESULTS.ids.splice(i, 1);
                i++;
            }
            else
                RESULTS.ids[i] = productJson;
        }
        productPrint(RESULTS.ids[i], i);
    }
}

function productPrint(product, i) {
    let tags = product.tags;

    $('.results').append(`
    <form class='productEdit' id='${i}'>
        <p>Name: ${product.name}</p> <input type='text' name='editPName${i}' placeholder='New name here'>
        <p>Tags:  ${tags.toString()}</p><input type='text' name='editTags${i}' placeholder='New tags here'>
        <p>Price: ${product.price}</p><input type='text' name='editPrice${i}' placeholder='New price here'>
        <img src = "${product.thumbnail}" alt = "Image of game"><input type='text' name='editThumbnail${i}' placeholder='New thumbnail here'>
        <input type='submit' class='productClick' value='Update'>
        <input type='submit' class='productClick' value='Delete'>
    </form>`)
}

/*------------------------ EVENTS -----------------------*/

function watchEventsGET() {
    $('.eventSearch').on('submit', function (event) {
        event.preventDefault();
        console.log('You submitted the form');
        $('.results').empty();

        let queries = '?';

        let name = $('input[name="eventName"]').val();
        console.log(name);

        if (name !== "")
            queries += `name=${name}&`;
        console.log(queries);
        getEvents(queries);
    });
}

function getEvents(queries) {
    console.log('You are in the getEvents');
    let reqUrl = './events';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayEvents, errorFetch, false);
}

function displayEvents(eventsJson) {
    for (let i = 0; i < eventsJson.length; i++) {
        console.log('Displaying Events');
        $('.results').append(`
        <p>Name: ${eventsJson[i].name}</p>
        <p>Date:  ${eventsJson[i].date}</p>
        <p>Price: ${eventsJson[i].price}</p>
        <p>Current Attendance: ${eventsJson[i].attend.length} out of ${eventsJson[i].maxAttend}</p>
        <img src = "${eventsJson[i].thumbnail}" alt = "Image of game">`)
    };
}

function watchEventsPOST() {

}

function watchEventsUpdate() {

}

/*------------------------INITIALIZATION----------------*/

function watchButtons() {
    $('.newChoice').on('click', function (event) {
        event.preventDefault();
        if ($(event.currentTarget).attr('id') == 'createUser')
            $('.blankFields').html(`
            <div class='gridInputs'>
                <label for=userName>Name: </label>
                <input type='text' name='userName' placeholder='username'>
                <label for=password>Password: </label>
                <input type='text' name='password' placeholder='password'>
                <label for=email>Email: </label>
                <input type='text' name='email' placeholder='email@address.com'>
                <label for=authority>Authority Level: </label>
                <input type='text' name='authority' placeholder='1-3'>
                </div>
            <input type='submit' id='productCreate' value='Submit'>
            `)
        if ($(event.currentTarget).attr('id') == 'createProduct')
            $('.blankFields').html(`
            <div class='gridInputs'>
                <label for=prodName>Name: </label>
                <input type='text' name='prodName' class='required' placeholder='product name'>
                <label for=tags>Tags: </label>
                <input type='text' name='tags' class='required' placeholder='card, dice, e.g.'>
                <label for=price>Price: $</label>
                <input type='text' name='price' class='required' placeholder='price'>
                <label for=thumbnail>Thumbnail Image Link: </label>
                <input type='text' name='thumbnail' class='required' placeholder='photoplace.com/img e.g.'>
            </div>
            <input type='submit' id='productCreate' value='Submit'>
        `)
        if ($(event.currentTarget).attr('id') == 'createEvent')
            $('.blankFields').html(`
            <div class='gridInputs'>
                <label for=eventName>Name: </label>
                <input type='text' name='eventName' placeholder='event name'>
                <label for=date>Date: </label>
                <input type='text' name='date' placeholder='month date, YYYY TT:TT:TT'>
                <label for=price>Price: $</label>
                <input type='text' name='price' placeholder='price'>
                <label for=max>Maximum Attend: </label>
                <input type='text' name='max' placeholder='maximum attendees'>
                <label for=currentAttend>Attending: </label>
                <input type='text' name='currentAttend'     placeholder='emails of attendees'>
                <label for=thumbnail>Thumbnail Image Link: </label>
                <input type='text' name='thumbnail' placeholder='photoplace.com/img e.g.'>
            </div>
            <input type='submit' id='productCreate' value='Submit'>
        `)
    });
}

function watchForms() {
    watchButtons();

    watchUsersGET();
    watchUsersPOST();
    watchUsersUpdate();

    watchProductsGET();
    watchProductsPOST();
    watchProductsUpdate();

    watchEventsGET();
    watchEventsPOST();
    watchEventsUpdate();

    console.log('watchForms is listening');
}

watchForms();


//Data tables jquery plugin enables pagination. 