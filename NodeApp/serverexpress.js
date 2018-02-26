﻿const express = require('express');
const expressstatic = require('express-static');
const http = require('http');
const urllib = require('url');
const util = require('util');
const querystrq = require('querystring');
const fs = require('fs');
const xml2js = require('xml2js');
const parseString = require('xml2js').parseString;
const bodyparser = require('body-parser');
const xmlreader = require("xmlreader");
const fastxmlparser = require('fast-xml-parser');

const builder = new xml2js.Builder;
const parser = new xml2js.Parser;

var users = {
    'blue': '1234',
    'yell': '222',
    'Jim':'4369'
};
var jsonneedreturn = {
    xml: {
        ToUserName: '',
        FromUserName: '',
        CreateTime: '',
        MsgType: '',
        Content :'',
    }
};

//var returnstr = fs.readFile('../NodeApp/Package/responsetxt.xml', 'utf-8', function (err, res) {
//    if (err !== null) {
//        return;
//    }
//    jsonneedreturn = fastxmlparser.parse(res);
//    console.log(jsonneedreturn);
//});

var server = express();
server.use(bodyparser());
server.get('/WebPage/index.html', function (req, res) {
    var params = urllib.parse(req.url, true);
    var file_name = 'F:/Jimtest/NodeApp/NodeApp';
    if (params.pathname == '/favicon.ico') {
        file_name = "";
        //res.end();
    } else {
        file_name = file_name + params.pathname;
    }
    if (file_name !== "") {
        fs.readFile(file_name, function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            if (err) {
                res.write('404');
            } else {
                res.write(data);
            }
            res.end();
        });
    } else {
        //res.end();
    }
});
server.get('/Login', function (req, res) {
    console.log('Have Log in request!');
    var username = req.query['user'];
    var password = req.query['pass'];

    if (users[username] == null) {
        res.send({ 'ok': false, 'msg': 'LogIn failed' });
    } else {
        if (users[username] != password) {
            res.send({ 'ok': false, 'msg': 'password incorrect!' });
        } else {
            res.send({ 'ok': true, 'msg': 'LogIn success!' });
        }
    }
});
server.get('/WX', function (req, res) {
    console.log('Have Log in request!');
    var get = req.query;
    console.log(get);
    //res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.send(get.echostr);
    res.end;
});
/*
    XML from Wechat :
    <xml> <ToUserName>< ![CDATA[toUser] ]></ToUserName>
    <FromUserName>< ![CDATA[fromUser] ]></FromUserName>
    <CreateTime>12345678</CreateTime>
    <MsgType>< ![CDATA[text] ]></MsgType>
    <Content>< ![CDATA[你好] ]></Content> </xml>

*/
server.post('/WX', function (req, res, next) {

    console.log('received!');
    var str = '';
    req.on('data', function (data) {
        str += data;
        
        //console.log(jsonfromwx);
    });
    req.on('end', function () {
        req.body = querystrq.parse(str);
        console.log(req.body);
        //console.log(parms);
        parseString(str, function (err, result) {
            if (err) {
                
            } else {
                console.log(result);


                console.log(jsonneedreturn);
                ////jasonfromwx = JSON.stringify(result);
                console.log(result.xml['Content']);
                jsonneedreturn.xml.ToUserName = result.xml['FromUserName'];
                jsonneedreturn.xml.FromUserName = result.xml['ToUserName'];
                jsonneedreturn.xml.MsgType = result.xml['MsgType'];
                jsonneedreturn.xml.Content = result.xml['Content'];
                jsonneedreturn.xml.CreateTime = Date.now();
                var returnxml = builder.buildObject(jsonneedreturn);

                console.log('return json : ' + returnxml);
                //req.body = result;

                res.send(returnxml);

            }
        });
    });
    
    //var parms = querystrq.parse(data.toString());
    //var jsonfromwx;
    ////console.log(parms);
    //parseString(parms, function (err, result) {
    //    if (err == null) {
    //        jasonfromwx = JSON.stringify(result);
    //        console.log(jasonfromwx.Content);
    //    }
    //});
    //res.send(true);
    //res.send(' ');
    
});

//server.use(function (req, res, next) {
//    console.log('123     '+req.body);
//    res.send(req.body);
//    //res.end();
//})
    server.listen(80);