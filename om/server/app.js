var express = require('express')
  , http = require('http')
  , path = require('path');

var nunjucks = require('nunjucks');

var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname+'/../html/'));
env.express(app);

app.configure('all', function(){
    app.set('port', process.env.PORT || 5005);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

    var cssDir = __dirname +'/../css/';
    app.use(require('less-middleware')({ src: __dirname + '/../less/', dest: cssDir, prefix:'/css/', force:false }));
    app.use(require('less-middleware')({ src: __dirname + '/../../less/', dest: cssDir, prefix:'/css/', force:false }));
    app.use(express.static(path.join(__dirname + '/../')));
    app.use(express.static(path.join(__dirname + '/../../', 'js')));
    app.use(express.static(path.join(__dirname + '/../../', 'img')));
    app.use(app.router);

    // Since this is the last non-error-handling middleware used, we assume 404, as nothing else
    app.use(function(req, res, next){
        console.log('cant find: ', req.url);
        res.send('404: page not found');
    });
});


app.get('/:file', function(req, res){
    var fn = req.params.file;
    res.render(fn+'.html', {  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
