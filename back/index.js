const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const hpp = require('hpp');
const helmet = require('helmet');

const passportConfig = require('./passport');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

const prod = process.env.NODE_ENV === 'production';

dotenv.config();
const app = express();
db.sequelize.sync(); // 테이블을 알아서 생성해 줌
passportConfig(); // 패스포트 전략을 중앙통제실로 연결

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(cors({
    origin: 'http://jw910911.online',
    credentials: true,
  }));
} else {
  app.use(morgan('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  })); // cors 문제 처리
}

// 요청이 들어왔을때 요청을 찍어주는 기능을 할 수 있게된다.

// static middleware
app.use('/', express.static('uploads'));
// 아래 두줄이 있을때 req.body를 사용할 수 있게 된다.
app.use(express.json()); // JSON 형식의 본문을 처리한다.
app.use(express.urlencoded({ extended: true })); // Form으로 넘어온 데이터를 처리한다.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET, // 세션 암호화를 위한 시크릿
  cookie: {
    httpOnly: true,
    secure: false,
    domain: prod && '.jw910911.online',
  },
  name: 'jungwoo',
}));

app.get('/', (req, res) => {
  res.send('react nodebird 백엔드 정상 동작!');
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

// error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message || 'Error!!');
});

// 로컬 호스트의 서버 실행
app.listen(prod ? process.env.PORT : 3065, () => {
  console.log(`server is running on localhost: ${process.env.NODE_ENV === 'production' ? process.env.PORT : 3065}`);
});
