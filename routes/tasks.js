var express = require('express');
var router = express.Router();

var taskEvents = require('../task-events');
var Task = require('./../models/task');

//TASKS
router.get('/', function(req, res, next) {
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

//render the add task page
router.get('/addTask', function(req, res) {
    //create new task
  res.render('tasks/addTask');
});

router.post('/addTask', function (req, res, next) {
    var name = req.body.name;

    //Check Errors
    var errors = req.validationErrors();

    var newTask = new Task({
        name: name,
    });
    
    //create the task
   Task.create(newTask, function(err, task) {
        if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
        } else {
            console.log(task);
        }
    });

    //success message
    req.flash('success', 'Task has been added.');

    //redirect
    
    res.location('/tasks/addTask');
    res.redirect('../projects/');

});


router.get('/:id/edit', function(req, res) {
    Task.findById(req.params.id).exec(function(err,task) {
         if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
        } else if (!task) {
            res.render('404');
        } else {
            res.render('task/editTask', { task: task });
        }
    });
});


router.post('/:id', function(req, res) {
    Task.findById(req.params.id).exec(function(err, task) {
        if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
        } else if (!task) {
            res.render('404');
        } else {
            //update properties
            task.name = req.body.name;

            //save the task
            task.save(function(err) {
                if(err) {
                    res.render('error', {
                        error: err,
                        message: err.message
                    });
                } else {
                    //update Task
                    req.flash('success', 'Task updated.');
                    res.redirect('/projects/' + project.id);
                }
         });
      }
    });
});

router.delete('/:id', function(req, res) {
    console.log(req.params.id);
  Task.findByIdAndRemove(req.params.id).exec(function(err) {
    if(err) {
        res.render('error', {
            error: err,
            message: err.message
        });
    } else {
      req.flash('success', 'Task deleted.');
      res.redirect('/projects/:id');
    }
  });
});

module.exports = router;