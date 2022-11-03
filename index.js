const fs = require('fs');
const http = require('http');
const url = require('url');
const axios = require('axios');

const homeTemplate = fs.readFileSync('./templates/home.html','utf-8');
const cardTemplate = fs.readFileSync('./templates/card.html','utf-8');

function render(html,data) {
    let content = html;
    for (const [key, value] of Object.entries(data)) {
        content = content.replaceAll(`{{${key}}}`,value);
    }
    return content;
}

const server = http.createServer((req,res) => {
    const path = req.url;
    const {pathname , query} = url.parse(path,true);
    
    if (pathname === '/') {
        axios.get('https://filltext.com/?rows=10&fname={firstName}&lname={lastName}&category=[%22category1%22,%22category2%22,%22category3%22]&pretty=true')
        .then(function (response) {
            const users_html = response.data.map((user) => {
                user.fChar = user.fname.charAt(0);
                user.lChar = user.lname.charAt(0);
                return render(cardTemplate,user);
            })
            const homeTemplateView = render(homeTemplate,{users: users_html});
            res.writeHead(200,{'Content-type':'text/html'});
            return res.end(homeTemplateView);
            
        })
        .catch(function (error) {
            console.log(error);
            res.writeHead(404,{'Content-type':'text/html'});
            return res.end('<h1>No users found</h1>');
        })
        .then(function () {
            res.writeHead(404,{'Content-type':'text/html'});
            return res.end('<h1>No users found</h1>');
        });
    }
    else if (pathname === '/category') {

        axios.get(`https://filltext.com/?rows=10&fname={firstName}&lname={lastName}&category=category${query.id}&pretty=true`)
        .then(function (response) {
            const users_html = response.data.map((user) => {
                user.fChar = user.fname.charAt(0);
                user.lChar = user.lname.charAt(0);
                return render(cardTemplate,user);
            })
            const homeTemplateView = render(homeTemplate,{users: users_html});
            res.writeHead(200,{'Content-type':'text/html'});
            return res.end(homeTemplateView);
            
        })
        .catch(function (error) {
            console.log(error);
            res.writeHead(404,{'Content-type':'text/html'});
            return res.end('<h1>No users found</h1>');
        })
        .then(function () {
            res.writeHead(404,{'Content-type':'text/html'});
            return res.end('<h1>No users found</h1>');
        });
    }
    else{
        res.writeHead(404,{'Content-type':'text/html'});
        return res.end('<h1>Page not found</h1>');
    }
    
});

server.listen(3000,'127.0.0.1',() => {
    console.log('Server listening on port 3000');
});