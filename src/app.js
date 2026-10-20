'use strict';

const express = require('express');

const authRoutes = require('./modules/auth/auth.routes');
const membersRoutes = require('./modules/members/members.routes');
const { errorHandler, notFound } = require('./shared/middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb', strict: true }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/members', membersRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
