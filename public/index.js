'use strict'

const BASE_URL = "DUMMY";

function loginSubmit(username, password) {
    let login_url = "./auth/login";
    let SETTINGS = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: {
            "username": username,
            "password": password
        }
    };
    console.log(login_url + JSON.stringify(SETTINGS));
    fetch(login_url, SETTINGS)
        .then(response => {
            if (response.ok) {
                console.log(response);
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            $(".loginResponse").html(`You have logged in successfully`);
            localStorage.setItem(responseJson);
        })
}

function watchForm() {
    $(".login").on("submit", event => {
        event.preventDefault();
        let username = $(".username").val();
        let password = $(".password").val();
        console.log(username + password);
        loginSubmit(username, password);
    });
}

watchForm();