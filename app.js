const express = require('express');
const cors= require('cors');
const audioRoutes = require('./routes/audioRoute');
const userRouter = require('./routes/userRoutes.js');
const AppError = require('./utils/AppError.js');

const app = express();
app.use(cors());
// Move audio routes BEFORE json parser to allow multer multipart processing
app.use('/api/audio', audioRoutes);
app.use(express.json());
// /* ------------------------  STATIC FILES (public/) -------------------------- */
// app.use(express.static(path.join(__dirname, 'public')));

// /* ---------------------- 3) RATE LIMITING (before routes) --------------------- */
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests, please try again after an hour',
// });
// app.use('/api', limiter);

// /* ---------------------- 4) BODY PARSER (after security) ---------------------- */
// app.use(express.json({ limit: '10kb' }));
// app.use(urlencoded({ extended: true, limit: '10kb' }));

/* ---------------- 5) DATA SANITIZATION (mongo + xss ) ------------------- */
// app.use(mongoSanitize());
// app.use(xss());
// app.use(compression());
/* ------------------------------- 7) ROUTES ---------------------------------- */
// app.use((req, res, next) => {
//   console.log('CONTENT TYPE:', req.headers['content-type']);
//   next();
// });

app.use('/api/users', userRouter);

/* --------------------------- 8) 404 HANDLER --------------------------------- */
app.all(/.*/, (req, res, next) => {
  console.log('req is ',req);
  const message =
    process.env.NODE_ENV === 'development'
      ? `Can not find ${req.originalUrl} on this server!`
      : 'Resource not found!';
  next(new AppError(message, 404));
});

module.exports = app;
