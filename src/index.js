import app from './app';

const { PORT = 8080 } = process.env;
app.listen(PORT, localhost,() => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-console
