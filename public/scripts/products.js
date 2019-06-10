'use strict';

/*Product model
name: { type: String, required: true },
tags: [{ type: String }],
price: { type: Number },
thumbnail: {type: String}*/

function displayProducts(productsJson){
    for (let i = 0; i<productsJson.length; i++){
        let tags = productsJson[i].tags;

        $('.productListing').append(`
        <div class='product'>
            <div class='describe'>
                <p>${productsJson[i].name}</p>
                <p>Tags:  ${tags.toString()}</p>
                <p>Price: $${productsJson[i].price}</p>
            </div>
            <img src = "${productsJson[i].thumbnail}" alt = "Image of game">
        </div>`
        )
    };
}

function getProducts(queries) {
    console.log('You are in the getProducts');
    let reqUrl = './products';
    if (queries)
    reqUrl = reqUrl.concat(queries);
    console.log(reqUrl);
    baseCall(reqUrl, 'GET', displayProducts, errorGetProducts, false);
}

function errorGetProducts(err){
    console.log(err);
}

// fix code for cases where some queries are blank
function watchSearch(){
    console.log('watchSearch is listening');
    $('.search').on('submit', function(event){
        event.preventDefault();
            console.log('You submitted the form');
        $('.productListing').empty();
            console.log('You are in the watchSearch');
        let queries='?';

        let name= $('input[name="pname"]').val();
            console.log(name);
        let tags= $('input[name="tags"]').val();
            console.log(tags);

        if (name !== "")
            queries += `name=${name}&`;

        if (tags !== "")
            queries += `tags=${tags}&`;


        console.log('Queries are '+ queries);
        getProducts(queries);
    });
}

function runProducts(){
    watchSearch();
    getProducts();
}

runProducts();