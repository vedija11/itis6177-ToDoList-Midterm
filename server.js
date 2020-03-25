const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const dotenv = require('dotenv');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

dotenv.config();

//Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

const mongoose = require('mongoose');
//Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "ToDoList API",
            description: "ToDoList API Information",
            contact: {
                name: "Vedija Jagtap"
            },
            servers: ["http://localhost:3000"]
        }
    },
    // ['.routes/*.js']
    apis: ["server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /users:
 *  get:
 *    description: Used to request all users
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /users:
 *    post:
 *      description: Used to save a user
 *    parameters:
 *      - name: user
 *        in: query
 *        description: Name of our user
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created response
 */

/**
 * @swagger
 * /users/new:
 *    get:
 *      description: Used to request create new user page
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /users/:id:
 *    get:
 *      description: Used to request user with specific id
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /users/:id/edit:
 *    get:
 *      description: Used to request the edit page with specific user id
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /users/:id:
 *    patch:
 *      description: Used to update the username for a specific user id
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /users/:id:
 *    delete:
 *      description: Used to delete a user with a specific user id
 *    responses:
 *      '200':
 *        description:  Successfully deleted user
 */
/**
 * @swagger
 * /tasks:
 *  get:
 *    description: Used to request all tasks
 *    responses:
 *      '200':
 *        description: A successful response
 */

/**
 * @swagger
 * /tasks:
 *    post:
 *      description: Used to save a task
 *    parameters:
 *      - name: taskName
 *        in: query
 *        description: Name of task created
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: user
 *        in: query
 *        description: Name of user who created task
 *        required: true
 *        schema:
 *          type: user
 *          format: string
 *      - name: Schedule Date
 *        in: query
 *        description: Date when the task is scheduled
 *        required: true
 *        schema:
 *          type: date
 *          format: date
 *      - name: description
 *        in: query
 *        description: Description of the task
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description: Successfully created response
 */

/**
 * @swagger
 * /tasks/new:
 *    get:
 *      description: Used to request create new task page
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /tasks/:id:
 *    get:
 *      description: Used to request task with specific id
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /tasks/:id/edit:
 *    get:
 *      description: Used to request the edit page with specific task id
 *    responses:
 *      '200':
 *        description:  A successful response
 */

/**
 * @swagger
 * /tasks/:id:
 *    put:
 *      description: Used to update a task with a specific user id
 *    parameters:
 *      - name: taskName
 *        in: query
 *        description: Name of task created
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: user
 *        in: query
 *        description: Name of user who created task
 *        required: true
 *        schema:
 *          type: user
 *          format: string
 *      - name: Schedule Date
 *        in: query
 *        description: Date when the task is scheduled
 *        required: true
 *        schema:
 *          type: date
 *          format: date
 *      - name: description
 *        in: query
 *        description: Description of the task
 *        required: false
 *        schema:
 *          type: string
 *          format: string
 *    responses:
 *      '201':
 *        description:  Successfully updated task
 */

/**
 * @swagger
 * /tasks/:id:
 *    delete:
 *      description: Used to delete a task with a specific task id
 *    responses:
 *      '200':
 *        description: Successfully deleted task
 */

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(process.env.PORT || 3000,
    () => console.log('Server is listening on port 3000!'));