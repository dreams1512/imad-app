var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var config = {
    user: 'dreams1512',
    database: 'dreams1512',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
    
};

var app = express();
app.use(morgan('combined'));
/*var articles = {
    articleOne:{
      title:"Article 1",
      heading: "article 1",
      date: "Aug 15 2017",
      content: `<p> "This is Article 1" </p>`
    },
    articleTwo:{
      title:"Article 2",
      heading: "article 2",
      date: "Aug 20 2017",
      content:
      `<p> "this is article 2 " </p>`
    },
    articleThree:{
      title:"Article 3",
      heading: "article 3",
      date: "Aug 24 2017",
      content:`<p>"This is Article 3"</p>`
    },
}; */

app.use(bodyParser.json());

function createTemplate(data)
{
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;
    var htmlTemplate = `
    <html>
    <head>
        <title> ${title} </title>
         <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class=container>
            <div>
                <a href='/'>Home </a>
            </div>
            <hr/>
            <h3>${heading}</h3>

            <div>
                <date> ${date.toDateString()} </date>
           </div>
            <div>
                 ${content}
             </div>
           
        </div>
    </body>
</html>
`;
return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


function hash(input, salt) {
    //how do we create Hash -- we will use the default library Crypto - google -node crypto
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000" , salt, hashed.toString('hex')].join('$'); // to return hash function which we are using and number of iteration , salt and hashed value as string and hexadecimal encoding to readable on screen
}

app.get('/hash/:input', function(req,res){
    
    var hashedString = hash(req.params.input, 'this-is-some-random-salt');
    res.send(hashedString);
});

var pool = new Pool(config);
app.post('/create-user', function(req,res) {
    //username, password
    //JSON -- {'username' : 'dream' , 'password' : 'test'}
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user1" (username, password) VALUES ($1,$2)', [username, dbString], function(err, result) {
        if (err)
            {
            res.status(500).send(err.toString());
            }
            else
            {
            res.send("user added successfully "+ username);
            }
    });
});
    

app.post('/login', function(req,res) {
    //username, password
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user1" WHERE username=$1', [username], function(err, result) {
          if (err) {            
            //res.status(500).send(err.toString());
            res.send("something wrong");
            }
            else 
            {
                if(result.rows.length === 0)
                {
                    res.send("username or password invalid");
              
                } else { 
                       //match the password
                       var dbString = result.rows[0].password;
                       var salt = dbString.split('$')[2];
                       var hashedPassword = hash(password,salt);
                       if (hashedPassword === dbString) {
                           res.send("Credentials Correct!!");
                       }else
                       {
                           res.send("invalid username");
                       }
            }
            }
    });
});

var pool = new Pool(config);
app.get('/test-db',function(req, res) {
    //make a select request
    // return a response with result
    pool.query("SELECT * FROM test", function(err, result)
    {
        if (err)
            {
            res.status(500).send(err.toString());
            }
            else
            {
            res.send(JSON.stringify(result.rows));
            }
    });    
});



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var counter=0;
app.get('/counter', function (req, res) {
    counter = counter + 1;
    res.send(counter.toString());
});

var names=[];
app.get('/submit-name', function (req, res) { //submit-name?name-xxxx
    //get name from request
    var name= req.query.name;
    names.push(name);
    //JSON - java script object notation
    res.send(JSON.stringify(names));
});



app.get('/articles/:articleName', function (req, res) {
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName] , function(err, result)
    {
        if (err)
            {
            res.status(500).send(err.toString());
            }
            else 
            {
            if(result.rows.length === 0 ) {
                res.status(404).send('Article not found')
               }
            else
            {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
            }
           
    });
});


/*app.get('/article1', function (req, res) {
  /res.sendFile(path.join(__dirname, 'ui', 'article1.html'));
});

app.get('/article2', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article2.html'));
});

app.get('/article3', function (req, res) {
 res.sendFile(path.join(__dirname, 'ui', 'article3.html'));
});
*/
app.get('/ui/main.js', function (req, res) {
 res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
