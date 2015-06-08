// дирректория где лежит Uccello
var uccelloDir = process.argv[2]&&process.argv[2]!='-'?process.argv[2]:'Uccello';
console.log('Using folder: '+uccelloDir);
// порт web
var uccelloPortWeb = process.argv[3]&&process.argv[3]!='-'?process.argv[3]:null;
// порт websocket
var uccelloPortWs = process.argv[4]&&process.argv[4]!='-'?process.argv[4]:null;

// Модули nodejs
var http = require('http');
var express = require('express');
var app = express();

// Обработчики express
// ----------------------------------------------------------------------------------------------------------------------

// обработчик файлов html будет шаблонизатор ejs
app.engine('html', require('ejs').renderFile);

// обработка /tests
app.get('/', function(req, res){
    res.render('game.html', { webSocketServerPort: UCCELLO_CONFIG.webSocketServer.port});
});

// компрессия статики
var compress = require('compression');
app.use(compress());

// статические данные и модули для подгрузки на клиент
app.use("/public", express.static(__dirname + '/public'));
app.use("/public/uccello", express.static(__dirname + '/../'+uccelloDir));

// ----------------------------------------------------------------------------------------------------------------------
// база данных
/*
 var Mysql = require('./db/mysql');
 var mysql = new Mysql();
 var mysqlConnection = mysql.connect({
 host:     'localhost',
 user:     'root',
 password: '111111',
 database: 'mobimed_test'
 });
 function mysqlAuthenticate(user, pass, done) {
 mysqlConnection.queryRow(
 'SELECT user_id, email FROM user WHERE username=? AND password=MD5(?)', [user, pass],
 function(err, row) {
 done(err, row);
 }
 );
 }
 */

/**
 * Функция заглушка для аутентификации
 * @param user
 * @param pass
 * @param done
 */
function fakeAuthenticate(user, pass, done) {
    var err = null, row = null;
    if (user.substring(0, 1)=='u' && pass.substring(0, 1)=='p')
        row = {user:user, user_id:1, email:user+'@gmail.com'};
    else {
        var users = {
            'Ivan':'123',
            'Olivier':'123',
            'Plato':'123'
        };
        if (users[user] && users[user]==pass) {
            row = {user:user, user_id:1, email:user+'@gmail.com'};
        }
    }
    done(err, row);
}


var config = {
    controls:[
        {className:'Wall', component:'wall', viewset:true, guid:'cfb20963-53ae-8b59-4d43-ab205d016b82'},
        {className:'Laby', component:'laby', viewset:true, guid:'6485c5b9-a725-264b-2436-5dbdff2cc6b1'},
        {className:'Item', component:'item', viewset:true, guid:'55c5c9e5-75fe-5eaf-a9a8-f03cd0748bef'}
    ],
    controlsPath: __dirname+'/../Game/public/controls/',
    dataPath: __dirname+'/../Game/data/',
    uccelloPath: __dirname+'/../'+uccelloDir+'/'
};

// модуль настроек
var UccelloConfig = require('../'+uccelloDir+'/config/config');
UCCELLO_CONFIG = new UccelloConfig(config);
if (uccelloPortWeb) UCCELLO_CONFIG.webServer.port = uccelloPortWeb;
if (uccelloPortWs) UCCELLO_CONFIG.webSocketServer.port = uccelloPortWs;
UCCELLO_CONFIG.logger.file = '../logs/game.csv';
DEBUG = false;

// логирование
logger = require('../'+uccelloDir+'/system/winstonLogger');

// очищаем файл лога при старте
if (UCCELLO_CONFIG.logger.clearOnStart) {
    var fs = require('fs');
    fs.writeFileSync(UCCELLO_CONFIG.logger.file, '');
}

// модуль сервера
var UccelloServ = require('../'+uccelloDir+'/uccelloServ');
var CommunicationServer = require('../' + uccelloDir + '/connection/commServer');

// комуникационный модуль
var communicationServer = new CommunicationServer.Server(UCCELLO_CONFIG.webSocketServer);
var uccelloServ = new UccelloServ({ authenticate: fakeAuthenticate, commServer: communicationServer });

// запускаем http сервер
http.createServer(app).listen(UCCELLO_CONFIG.webServer.port, '0.0.0.0');
console.log('Web server started http://127.0.0.1:'+UCCELLO_CONFIG.webServer.port+'/');

// зщапускаем коммуникационный сервер
communicationServer.start();
console.log("Communication Server started (port: " + UCCELLO_CONFIG.webSocketServer.port + ").");