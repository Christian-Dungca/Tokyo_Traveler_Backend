const express = require('express');
const bodyParser = require('body-parser');

const articleRoutes = require('./routes/article-routes');


const app = express();

app.use('/api/articles', articleRoutes);

app.listen(5000);