
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

}

function handleUsers(usersJson) {
    for (let i = 0; i < usersJson.length; i++) {
        RESULTS.emptyIds();
        RESULTS.ids[i] = usersJson[i]._id;

        $('.results').append(`
        <p>Name: ${usersJson[i].username}</p> <input type='text' name='editUName${i}' placeholder='New username here'>
        <p>Email:  ${usersJson[i].email}</p> <input type='text' name='editEmail${i}' placeholder='New email here'>
        <p>Authority: ${usersJson[i].authority}</p> <input type='text' name='editAuth${i}' placeholder='New authority here'><br>
        <input type = 'submit' class='userUpdate' value='Save'><br>
        <input type = 'submit' class='userDelete' value='Delete'>`)
    };
}

function getUsers(queries) {
    console.log('You are in the getUsers');
    let reqUrl = './users';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', handleUsers, errorFetch, true);
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

function getProducts(queries) {
    console.log('You are in the getProducts');
    let reqUrl = './products';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayProducts, errorFetch, false);
}

function displayProducts(products) {
    RESULTS.emptyIds();
    RESULTS.ids = products;
    for (let i = 0; i < RESULTS.ids.length; i++) {

        let tags = RESULTS.ids[i].tags;


        $('.results').append(`
        <form class='productEdit' id='${i}'>
            <p>Name: ${RESULTS.ids[i].name}</p> <input type='text' name='editPName${i}' placeholder='New name here'>
            <p>Tags:  ${tags.toString()}</p><input type='text' name='editTags${i}' placeholder='New tags here'>
            <p>Price: ${RESULTS.ids[i].price}</p><input type='text' name='editPrice${i}' placeholder='New price here'>
            <img src = "${RESULTS.ids[i].thumbnail}" alt = "Image of game"><input type='text' name='editThumbnail${i}' placeholder='New thumbnail here'>
            <input type='submit' class='buttonClick' value='Update'>
            <input type='submit' class='buttonClick' value='Delete'>
        </form>`)
    };
    console.log(RESULTS.ids);
}

function watchProductUpdate() {
    $('.results').on('click', '.buttonClick', function (event) {
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
            baseCall(reqUrl, 'PUT', displayProducts, errorFetch, true, body);
        }

        if (method == 'Delete') {
            baseCall(reqUrl, 'DELETE', displayProducts, errorFetch, true);
        }
    });
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

/*------------------------INITIALIZATION----------------*/

function watchButtons() {
    $('.newChoice').on(click, function (event) {
        if (event.currentTarget.value == 'User')
            $('.blankFields').html(`
                <label for=userName>Name: </label>
                <input type='text' name='userName' placeholder='username'>
                <label for=password>Password: </label>
                <input type='text' name='password' placeholder='password'>
                <label for=email>Email: </label>
                <input type='text' name='email' placeholder='email@address.com'>
                <label for=authority>Authority Level: </label>
                <input type='text' name='authority' placeholder='1-3'>
            `)
        else if (event.currentTarget.value == 'Product')
            $('.blankFields').html(`
            <label for=prodName>Name: </label>
            <input type='text' name='prodName' placeholder='product name'>
            <label for=tags>Tags: </label>
            <input type='text' name='tags' placeholder='card, dice, e.g.'>
            <label for=price>Price: $</label>
            <input type='text' name='price' placeholder='price'>
            <label for=thumbnail>Thumbnail Image Link: </label>
            <input type='text' name='thumbnail' placeholder='photoplace.com/img e.g.'>
        `)
        else (event.currentTarget.value == 'Event')
            $('.blankFields').html(`
            <label for=eventName>Name: </label>
            <input type='text' name='eventName' placeholder='event name'>
            <label for=date>Date: </label>
            <input type='text' name='date' placeholder='month date, YYYY TT:TT:TT'>
            <label for=price>Price: $</label>
            <input type='text' name='price' placeholder='price'>
            <label for=max>Maximum Attend: </label>
            <input type='text' name='max' placeholder='maximum attendees'>
            <label for=currentAttend>Attending: </label>
            <input type='text' name='currentAttend' placeholder='emails of attendees'>
            <label for=thumbnail>Thumbnail Image Link: </label>
            <input type='text' name='thumbnail' placeholder='photoplace.com/img e.g.'>
        `)
    });
}

function watchForms() {
    watchUsersGET();

    watchProductsGET();
    watchProductUpdate();

    watchEventsGET();

    console.log('watchForms is listening');
}

watchForms();