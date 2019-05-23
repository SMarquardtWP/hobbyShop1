'use strict';

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

function runEvents(){
    getEvents();
}

runEvents();