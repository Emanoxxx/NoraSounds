const axios = require('axios');
axios.get("http://emanoxxx.com:8080/").then(function(response){
    console.log("response");
}).catch(function(err){
    console.log("err");
});