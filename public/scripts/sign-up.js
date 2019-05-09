'use strict';

function submitSignup(user, email, pass) {
    //sets up settings for call
    let userData = {"username": user, "email": email, "password": pass};

    let settings = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: (JSON.stringify(userData))
    };

    //makes fetch call
    fetch('./../users', settings)
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

function successSignup(user){
    console.log('That was a successful signup.');
    $('.signUpMessage').html(`<p>Signup successful. Redirecting to home page.`);
    console.log(user);
    setTimeout(function() {
        location.replace("./../index.html");
    });
}

function invalidInputCheck(user, email, pass, conf) {
    console.log('Checking for validity');
    console.log(user);
    if (user == "") {
        $('.signUpMessage').html(`<p>Please enter a username.</p>`);
        return false;
    }
    console.log(email);
    if (email == "") {
        $('.signUpMessage').html(`<p>Please enter a valid email.</p>`);
        return false;
    }
    console.log(pass);
    if (pass == "") {
        $('.signUpMessage').html(`<p>Please enter a password.</p>`);
        return false;
    }
    console.log(conf);
    if (pass !== conf) {
        $('.signUpMessage').html(`<p>Please make sure both passwords match.</p>`);
        return false;
    }

    console.log('That info is valid!');
    return true;
}

function watchForm() {
    $('form').on('submit', function (event) {
        event.preventDefault();
        let username = $('#username').val();
        let email = $('#email').val()
        let password = $('#password').val();
        let passConf = $('#passConf').val();
        if ( invalidInputCheck(username, email, password, passConf) === true){
            console.log('Made it ouf of invalid check');
            submitSignup(username, email, password);
        }
    });
}

watchForm();