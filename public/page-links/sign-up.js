'use strict';

function submitSignup(user, pass, conf) {
    //sets up settings for call
    let userData = {"username": user, "password": pass};

    let settings = {
        method: POST,
        headers: {
            'Content-Type': 'application/json'
        },
        body: (JSON.stringify(userData))
    };

    //makes fetch call
    fetch('./users', settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => successSignup(responseJson))
        .catch(err => {
            console.log('Internal server error');
        });
}

function successSignup()

function invalidInputCheck(user, pass, conf) {
    console.log('Checking for validity');
    console.log(user);
    if (user == "") {
        $('.signUpError').html(`<p>Please enter a username.</p>`);
        return false;
    }
    console.log(pass);
    if (pass == "") {
        $('.signUpError').html(`<p>Please enter a password.</p>`);
        return false;
    }
    console.log(conf);
    if (pass !== conf) {
        $('.signUpError').html(`<p>Please make sure both passwords match.</p>`);
        return false;
    }

    console.log('That info is valid!');
    return true;
}

function watchForm() {
    $('form').on('submit', function (event) {
        event.preventDefault();
        let username = $('#username').val();
        let password = $('#password').val();
        let passConf = $('#passConf').val();
        if (invalidInputCheck(username, password, passConf) === true)
            submitSignup(username, password, passConf)
    });
}

watchForm();