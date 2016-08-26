"use strict";

var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
var multer = require('multer'),
	path = require('path');
//handle file uploads - setting destination of where to load

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/projects')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })

//links to project.js
var Project = require('./../models/project');

router.get('/', function (req, res, next) {
   Project.find({}).exec( function(err, projects) {
       if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
       } else {
           res.render('projects/index', { projects: projects }); 
       }
   });
});

//render the add project page
router.get('/add', function(req, res) {
    //create new project
  res.render('projects/add');
});

router.post('/add', upload.single('projectImage'), function (req, res, next) {
    var projectTitle = req.body.projectTitle;
    var projectClient = req.body.projectClient;
    var projectDesc = req.body.projectDesc;
    

    //Form validator
    //make sure the required fields are not empty and are vaild
    req.checkBody('projectTitle', 'Project Title is required').notEmpty();
    req.checkBody('projectClient', 'Client name is required').notEmpty();
    req.checkBody('projectDesc', 'Project description is required').notEmpty();

    //check image uploads
    if(req.file){
        var projectImageName = req.file.originalname;
    } else {
        var projectImageName = 'noimage.jpg';
    }  
    //Check Errors
    var errors = req.validationErrors();

    var newProject = new Project({
        projectTitle: projectTitle,
        projectClient: projectClient,
        projectDesc: projectDesc,
        projectImage: projectImageName
    });
    
    //create the project
   Project.create(newProject, function(err, project) {
        if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
        } else {
            console.log(project);
        }
    });

    //success message
    req.flash('success', 'Project has been added.');

    //redirect
   res.location('/projects/add');
    res.redirect('/projects');

});

//project detail
router.get('/:id', function(req, res) {
  Project.findById(req.params.id).exec(function(err, project) {
    if(err) {
        res.render('error', {
            error: err,
            message: err.message
        });
    } else if (!project) {
      res.render('404');
    } else {
      res.render('projects/show', {project: project});
    }
  });
});


router.get('/:id/edit', function(req, res) {
    Project.findById(req.params.id).exec(function(err,project) {
         if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
        } else if (!project) {
            res.render('404');
        } else {
            res.render('projects/edit', { project: project });
        }
    });
});


router.post('/:id', upload.single('projectImage'), function(req, res) {
    Project.findById(req.params.id).exec(function(err, project) {
        if(err) {
            res.render('error', {
                error: err,
                message: err.message
            });
        } else if (!project) {
            res.render('404');
        } else {
            //update properties
            project.projectTitle = req.body.projectTitle;
            project.projectClient = req.body.projectClient;
            project.projectDesc = req.body.projectDesc;

            //save the post
            project.save(function(err) {
                if(err) {
                    res.render('error', {
                        error: err,
                        message: err.message
                    });
                } else {
                    //update Project
                    req.flash('success', 'Project updated.');
                    res.redirect('/projects/' + project.id);
                }
         });
      }
    });
});

router.delete('/:id', function(req, res) {
    console.log(req.params.id);
  Project.findByIdAndRemove(req.params.id).exec(function(err) {
    if(err) {
        res.render('error', {
            error: err,
            message: err.message
        });
    } else {
      req.flash('success', 'Project deleted.');
      res.redirect('/projects');
    }
  });
});
   

module.exports = router;