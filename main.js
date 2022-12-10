const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path');
const mysql = require('mysql');
const FileStore = require('session-file-store')(session); // 세션을 파일에 저장
const cookieParser = require('cookie-parser');

var authRouter = require('./auth.js');
var authCheck = require('./authCheck.js');
var template = require('./template.js');


// const port = 80,
//     express = require("express"),
//     app = express();
const app = express()
const port = 80

app.use(bodyParser.urlencoded({extended : false }));
app.use(session({
    secret : '~',
    resave :  false,
    saveUninitialized: true,
    store: new FileStore(),
}))
app.get('/', (req, res) => {
    if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
      res.redirect('/auth/login');
      return false;
    } else {                                      // 로그인 되어있으면 메인 페이지로 이동시킴
      res.redirect('/main');
      return false;
    }
  })
  
  // 인증 라우터
  app.use('/auth', authRouter);
  
  // 메인 페이지
  app.get('/main', (req, res) => {
    if (!authCheck.isOwner(req, res)) {  // 로그인 안되어있으면 로그인 페이지로 이동시킴
      res.redirect('/auth/login');
      return false;
    }
    var html = template.HTML('Welcome',
      `<hr>
          <h2>메인 페이지에 오신 것을 환영합니다</h2>
          <p>로그인에 성공하셨습니다.</p>`,
      authCheck.statusUI(req, res)
    );
    res.send(html);
  })
 

// app.listen(app.get("port"), () => {
//     console.log(`Server running at http://localhost:${app.get("port")}`);
//   });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  
