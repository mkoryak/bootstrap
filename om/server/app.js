var express = require('express')
  , http = require('http')
  , path = require('path');

var rootDir = __dirname +'/../..';  //real project root

var nunjucks = require('nunjucks');

var app = express();

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(rootDir+'/om/html/'));
env.express(app);

app.configure('all', function(){
    app.set('port', process.env.PORT || 5005);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());


    var cssDir = rootDir +'/compiled/css/';
    app.use(require('less-middleware')({ src: rootDir+'/bootstrap/less/', dest: cssDir, prefix:'/css/', force:false }));
    app.use(require('less-middleware')({ src: rootDir+'/om/less/', dest: cssDir, prefix:'/css/', force:false }));
    app.use(express.static(rootDir+'/bootstrap/'));
    app.use(express.static(rootDir+'/om/'));
    app.use(express.static(rootDir+'/compiled/'));
    app.use(app.router);

    // Since this is the last non-error-handling middleware used, we assume 404, as nothing else
    app.use(function(req, res, next){
        console.log('cant find: ', req.url);
        res.send('404: page not found');
    });
});

app.get('/', function(req, res){
    res.render('index.html', {selectedTab: 'index'});
});
app.get('/:file', function(req, res){
    var fn = req.params.file;
    var tabName = fn.substring(0, fn.length - 5);
    res.render(fn, {selectedTab: tabName});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
