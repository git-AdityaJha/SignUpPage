const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express(); // now we can let that app listen to the port 3000

// to be able to send static files like css file and bootstrap link inside the html file we need to use a special function of express module : 
app.use(express.static("public")); // public is the folder name that contains css and images files that are static in nature.

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed", 
        merge_fields: {
          FNAME: firstName, 
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/de9d917960";

  const options = {
    method: "POST",
    auth: "aditya:fd898fdb819d23444bf225352346ada7-us21"
  }

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } 
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();  

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 5000, function(){
  console.log("Server is running on port 5000");
})


// API key :
// fd898fdb819d23444bf225352346ada7-us21

// List id :
// de9d917960