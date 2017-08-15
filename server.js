var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));
var articles = {
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
};

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
                <date> ${date} </date>
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

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/:articleName', function (req, res) {
    res.send(createTemplate(articles[articleName]));
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
