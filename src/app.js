import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';

// Route importing
import info from './routes/info';
import categories from './routes/categories';
import questions from './routes/questions';
import users from './routes/users';

const app = express();
app.disable('x-powered-by');

// Add logging for dev
app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));

// Middleware for parsing HTTP payload
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware for serving static assets
app.use(express.static(path.join(__dirname, '../public')));

// Bind route handler to a route
app.use('/', info);
app.use('/categories', categories);
app.use('/questions', questions);
app.use('/users', users);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler for schema validation failures
app.use(function (err, req, res, next) {

  // Handle only validation errors
  // everything else gets passed to the default error handler
  if (err.name === 'JsonSchemaValidation') {
    res.status(400);
    res.json({
      statusText: 'Bad Request',
      jsonSchemaValidation: true,
      validations: err.validations  // All of your validation information
    });
  } else {
    next(err);
  }
});

// Default error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV === 'development') {
    res
      .status(err.status || 500)
      .json({ message: err.message, trace: err.trace });
  } else {
    res
      .status(err.status || 500)
      .json({ message: err.message });
  }

});

export default app;
