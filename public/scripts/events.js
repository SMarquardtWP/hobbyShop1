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
    console.log('Making call');
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

function displayEvents(eventsJson){
    for (let i = 0; i<eventsJson.length; i++){
        console.log('Displaying Events');
        $('.eventListing').append(`
        <p>Name: ${eventsJson[i].name}</p>
        <p>Date:  ${eventsJson[i].date}</p>
        <p>Price: ${eventsJson[i].price}</p>
        <p>Current Attendance: ${eventsJson[i].attend.length} out of ${eventsJson[i].maxAttend}</p>
        <img src = "${eventsJson[i].thumbnail}" alt = "Image of game">`)
    };
}

function getEvents(queries) {
    console.log('You are in the getEvents');
    let reqUrl = './events';
    if (queries)
    reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayEvents, errorFetch, false);
}

function errorFetch(err){
    console.log(err);
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

function runEvents(){
    watchLogin();
    getEvents();
}

runEvents();