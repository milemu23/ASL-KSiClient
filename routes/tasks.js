var express = require('express');
var router = express.Router();
var taskEvents = require('../task-events');
var fs = require('fs');

var Task = require('./../models/task');

//TASKS
router.get('/', function(req, res) {
   console.log('get tasks');
    Task.find({}).exec( function(err, tasks) {
       if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
       } else {
           res.render('tasks/index', { tasks: tasks }); 
       }
   });
});

router.get('/start-task', function(req, res) {
    taskEvents.emit('startTimer', res);
});

module.exports = router;