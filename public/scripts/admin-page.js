
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

function displayPost(responseType, message) {
    /* responseType 1 = error/incorrect entry message */
    $('.postOutcome').css('display', 'inline-block');
    if (responseType == 1) {
        $('.postOutcome').css('color', '#984B43')
        $('.postOutcome').html(`<p>${message}</p>`);
    } else {
        $('.postOutcome').html(`<p>Successfully created new item.</p>`);
    }
    $('.postOutcome').fadeOut(4000);
}

function checkEmpty() {
    console.log('Required fields are: ' + $('.blankFields').find('.required'));
    let empty = false;
    $('.blankFields').find('.required').each(function () {
        if (!$(this).val()) {
            console.log("field is" + $(this).val());
            empty = true;
        }
    });

    if (empty == true)
        return true
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

        let empty = checkEmpty();

        if (empty = true) {
            displayPost(1, 'Please fill in all required fields');
        } else {
            let body = {};
            let reqUrl = './users';
            body.username = $('.blankFields').find('input[name="userName"]').val();
            console.log(body.name);
            body.password = $('.blankFields').find('input[name="password"]').val();
            body.email = $('.blankFields').find('input[name="email"]').val();
            body.auth = $('.blankFields').find('input[name="authority"]').val();

            console.log(body);

            baseCall(reqUrl, 'POST', displayPost, errorFetch, false, body);
        }
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

        let name = $('input[name="productName"]').val();
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

        let empty = checkEmpty();

        console.log("empty is: " + empty);

        if (empty = true) {
            displayPost(1, 'Please fill in all required fields');
        } else {
            let body = {};
            let reqUrl = './products';
            body.name = $('.blankFields').find('input[name="productName"]').val();
            console.log(body.name);
            body.tags = $('.blankFields').find('input[name="tags"]').val();
            body.price = $('.blankFields').find('input[name="price"]').val();
            body.thumbnail = $('.blankFields').find('input[name="thumbnail"]').val();
            console.log(body);

            baseCall(reqUrl, 'POST', displayPost, errorFetch, true, body);
        }
    })
}


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
    $('.eventSearch').on('submit', function (e) {
        e.preventDefault();
        console.log('You submitted the form');
        $('.results').empty();
        let queries = '?';

        let name = $('input[name="eventName"]').val();
        console.log(name);

        if (name !== "")
            queries += `name=${name}`;

        console.log(queries);
        getEvents(queries);
    });
}

function watchEventsPOST() {
    console.log('watching for POSTS in events');
    $('.blankFields').on('click', '#eventCreate', function (e) {
        e.preventDefault();

        console.log('Heard POST request');

        let empty = checkEmpty();

        if (empty = true) {
            displayPost(1, 'Please fill in all required fields');
        } else {
            let body = {};
            let eventDate = new Date(
                $('.blankFields').find('input[name="year"]').val(),
                $('.blankFields').find('input[name="month"]').val() - 1,
                $('.blankFields').find('input[name="day"]').val(),
                $('.blankFields').find('input[name="hour"]').val(),
                $('.blankFields').find('input[name="minute"]').val()
            );

            console.log(eventDate);

            let reqUrl = './events';
            body.name = $('.blankFields').find('input[name="eventName"]').val();
            console.log(body.name);
            body.date = eventDate;
            body.price = $('.blankFields').find('input[name="price"]').val();
            body.maxAttend = $('.blankFields').find('input[name="maxAttend"]').val();
            body.thumbnail = $('.blankFields').find('input[name="thumbnail"]').val();

            console.log(body);

            baseCall(reqUrl, 'POST', displayPost, errorFetch, true, body);
        }
    })
}

function watchEventsUpdate() {
    console.log('watching for updates');
    $('.results').on('click', '.eventClick', function (e) {
        e.preventDefault();

        let index = $(e.currentTarget).parent().attr('id');
        let method = e.currentTarget.value;
        console.log('index', index);
        let reqUrl = `./events/${RESULTS.ids[index]._id}`;
        let newName;
        let newDate;
        let newPrice;
        let newMax;
        let newThumbnail;
        let body = {};

        if ($(`input[name="editEName${index}"]`).val() != '') {
            newName = $(`input[name="editEName${index}"]`).val();
            body.name = newName;
        }
        if ($(`input[name="editDate${index}"]`).val() != '') {
            newTags = $(`input[name="editDate${index}"]`).val();
            body.date = newDate;
        }
        if ($(`input[name="editPrice${index}"]`).val() != '') {
            newPrice = $(`input[name="editPrice${index}"]`).val();
            body.price = newPrice;
        }
        if ($(`input[name="editMax${index}"]`).val() != '') {
            newMax = $(`input[name="editMax${index}"]`).val();
            body.maxAttend = newMax;
        }
        if ($(`input[name="editThumbnail${index}"]`).val() != '') {
            newThumbnail = $(`input[name="editThumbnail${index}"]`).val();
            body.thumbnail = newThumbnail;
        }

        console.log(body);

        if (method == 'Update') {
            baseCall(reqUrl, 'PUT', displayEventUpdate, errorFetch, true, body);
        }

        if (method == 'Delete') {
            baseCall(reqUrl, 'DELETE', displayEventUpdate, errorFetch, true);
        }
    });
}

function getEvents(queries) {
    console.log('You are in the getEvents');
    let reqUrl = './events';
    if (queries)
        reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayEvents, errorFetch, true);
}

function displayEvents(eventsJson) {
    RESULTS.emptyIds();
    RESULTS.ids = eventsJson;
    for (let i = 0; i < RESULTS.ids.length; i++) {
        eventPrint(RESULTS.ids[i], i);
    };
    console.log(RESULTS.ids);
}

function displayEventUpdate(eventJson) {
    console.log('Displaying Your Update');
    console.log(eventJson);
    $('.results').empty();
    for (let i = 0; i < RESULTS.ids.length; i++) {
        if (eventJson._id == RESULTS.ids[i]._id) {
            if (eventJson.status == "DELETE") {
                let removed = RESULTS.ids.splice(i, 1);
                i++;
            }
            else
                RESULTS.ids[i] = eventJson;
        }
        eventPrint(RESULTS.ids[i], i);
    }
}

/*
            name: req.body.name,
            date: new Date(req.body.date),
            price: req.body.price,
            maxAttend: req.body.maxAttend,
            attend: req.body.attend,
            thumbnail: req.body.thumbnail
*/

function eventPrint(event, index) {

    let attending;
    for (let i = 0; i < event.attend.length; i++) {
        attending += `<dd><p>${event.attend[i]}</p><input type='checkbox' class='removeAttendee'</dd>`;
        console.log(attending);
    }
    if (attending == '') { attending = 'No one has signed up yet'; }
    console.log(attending);

    let d = new Date(event.date);

    $('.results').append(`
    <form class='eventEdit' id='${index}'>
        <p>Name: ${event.name}</p> <input type='text' name='editEName${index}' placeholder='New name here'>
        <p>Date:  ${d.toDateString()}, ${d.getHours()}:${d.getMinutes()}</p><input type='text' name='editTags${index}' placeholder='New Date here'>
        <p>Price: ${event.price}</p><input type='text' name='editPrice${index}' placeholder='New price here'>
        <p>Attendance: ${event.attend.length}/${event.maxAttend}</p><input type='text' name='editMax${index}' placeholder='New max attend'>
        <dl><dt>Attending Emails: <dt>
        ${attending}</dl>
        <img src = "${event.thumbnail}" alt = "Image of event"><input type='text' name='editThumbnail${index}' placeholder='New thumbnail here'>
        <input type='submit' class='eventClick' value='Update'>
        <input type='submit' class='eventClick' value='Delete'>
    </form>`)
}
/*------------------------INITIALIZATION----------------*/

function watchButtons() {
    $('.newChoice').on('click', function (event) {
        event.preventDefault();
        if ($(event.currentTarget).attr('id') == 'createUser')
            $('.blankFields').html(`
            <div class='right'>
                <div class='overflowManage'>
                    <label for=userName>Name: </label>
                    <input type='text' name='userName' class='required right' placeholder='username'>
                </div>
                <div class='overflowManage'>
                    <label for=password>Password: </label>
                    <input type='text' name='password' class='required right' placeholder='password'>
                </div>
                <div class='overflowManage'>
                    <label for=email>Email: </label>
                    <input type='text' name='email' class='required right' placeholder='email@address.com'>
                </div>
                <div class='overflowManage'>
                    <label for=authority>Authority Level: </label>
                    <input type='text' name='authority' class='required right' placeholder='1-3'>
                </div>
            </div>
            <input type='submit' id='userCreate' value='Submit'>
            `)
        if ($(event.currentTarget).attr('id') == 'createProduct')
            $('.blankFields').html(`
            <div class='right'>
                <div class='overflowManage'>
                    <label for=productName>Name: </label>
                    <input type='text' name='productName' class='required right' placeholder='product name'>
                </div>
                <div class='overflowManage'>
                    <label for=tags>Tags: </label>
                    <input type='text' name='tags' class='required right' placeholder='card, dice, e.g.'>
                </div>
                <div class='overflowManage'>
                    <label for=price>Price: $</label>
                    <input type='text' name='price' class='required right' placeholder='price'>
                </div>
                <div class='overflowManage'>
                    <label for=thumbnail>Thumbnail Image Link: </label>
                    <input type='text' name='thumbnail' class='required right' placeholder='photoplace.com/img e.g.'>
                </div>
            </div>
            <input type='submit' id='productCreate' value='Submit'>
        `)
        if ($(event.currentTarget).attr('id') == 'createEvent')
            $('.blankFields').html(`
            <div class='right'>
                <div class='overflowManage'>
                    <label for=eventName>Name: </label>
                    <input type='text' name='eventName' class='required right' placeholder='event name'>
                </div>
                <div class='overflowManage'>
                    <fieldset class='dateEntry'>
                        <legend>Date (month, day, year, time): </legend>
                            <label for=month>Month</label>
                            <input type='text' name='month' class='dateField required' placeholder='MM'><span class =''>/</span>
                            <label for=day>Day</label>
                            <input type='text' name='day' class='dateField required' placeholder='DD'><span class=''>/</span>
                            <label for=year>Year</label>
                            <input type='text' name='year' class='dateField required' placeholder='YYYY'><span class=''>/</span> 
                            <label for=hour>Hour</label>
                            <input type='text' name='hour' class='dateField required' placeholder='TT'><span class=''>:</span>
                            <label for=minute>Minute</label>
                            <input type='text' name='minute' class='dateField required ' placeholder='TT'>
                    </fieldset>
                </div>
                <div class='overflowManage'>
                    <label for=price>Price: $</label>
                    <input type='text' name='price' class='required right' placeholder='0 for free event'>
                </div>
                <div class='overflowManage'>
                    <label for=maxAttend>Maximum Attend: </label>
                    <input type='text' name='maxAttend' class='right' placeholder='maximum attendees'>
                </div>
                <div class='overflowManage'>
                    <label for=thumbnail>Thumbnail Image Link: </label>
                    <input type='text' name='thumbnail' class='right' placeholder='photoplace.com/img e.g.'>
                </div>
            </div>
            <input type='submit' id='eventCreate' value='Submit'>
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