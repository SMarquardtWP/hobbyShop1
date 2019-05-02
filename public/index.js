'use strict'

const BASE_URL = "DUMMY";

function baseCall(url, mthd, successCallback, errorCallback, auth, body){
    //sets up settings for call
    let settings = {
        method : mthd,
        headers : {
            'Content-Type' : 'application/json'
        }
    }
    if (body){
        settings.body = JSON.stringify(body);
    }
    if (auth){
        token = localStorage.getItem('token');
        settings.headers.Authorization = 'Bearer ' + token;
    }

    //makes fetch call
    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => successCallback(responseJson))
        .catch(err => {
            errorCallback(err);
        });
}

function successLogin(responseJSON){
    $(".loginResponse").html(`You have logged in successfully`);
    localStorage.setItem("token", responseJSON.authToken);
}

function errorLogin(err){
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

watchLogin();
watchLinks();