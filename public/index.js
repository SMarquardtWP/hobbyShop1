'use strict'



function loginSubmit(username, password){
    let login_url = "./auth"
    fetch
}

function watchForm() {
    $(".login").on("submit", event => {
        event.preventDefault();
        let username = $(".username").val();
        let password = $(".password").val();
        loginSubmit(username, password);
    });
}

watchForm();