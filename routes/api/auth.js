"use strict";

const Router = require('express').Router();
const issueTokens = require('../../middleware/issue-tokens');
const {login, register, verifyRefresh, test} = require('../../controllers/auth-controller');
const {logSchema, regSchema, validate} = require('../../middleware/validation');

const authCheck = require('../../middleware/authorize');

Router.route('/login')
    // @route  POST api/auth/login
    // @desc   POST login
    // @access Public
    .post(logSchema(), validate, login, issueTokens);

Router.route('/register')
    // @route  POST api/auth/register
    // @desc   POST Register a user
    // @access Public
    .post(regSchema(), validate, register, issueTokens);

Router.route('/profile')
    // @route  GET api/auth/profile
    // @desc   GET User profile data
    // @access Private
    .get(authCheck, test);

Router.route('/refresh')
    // @route  POST api/auth/refresh-token
    // @desc   POST Refresh access token
    // @access Public
    .post(verifyRefresh, issueTokens);

module.exports = Router;