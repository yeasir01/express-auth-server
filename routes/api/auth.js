const Router = require('express').Router();
const {login, register} = require('../../controllers/authController');
const {loginSchema, regSchema, tokenSchema, validate} = require('../../middleware/validation');

Router.route('/login')
    // @route  POST api/auth/login
    // @desc   POST login
    // @access Public
    .post(loginSchema(), validate, login);

Router.route('/register')
    // @route  POST api/auth/register
    // @desc   POST Register a user
    // @access Public
    .post(regSchema(), validate, register);

Router.route('/profile')
    // @route  GET api/auth/profile
    // @desc   GET User profile data
    // @access Private
    .get();

Router.route('/refresh-token')
    // @route  POST api/auth/refresh-token
    // @desc   POST Refresh access token
    // @access Public
    .post();

module.exports = Router;