var express = require('express');
var router = express.Router();
var multer = require('multer');
//handle file uploads - setting destination of where to load
var upload = multer({dest: './uploads/projects'});

//links to project.js
var Project = require('../models/project');

router.get('/', function (req, res) {
   Project.find({}).exec( function(err, projects) {
       if (err) {
           console.log("There is an error!");
           res.render('500');
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

router.post('/add', function (req, res) {
    var projectTitle = req.body.projectTitle;
    var projectClient = req.body.projectClient;
    var projectDesc = req.body.projectDesc;
    var projectImage = req.body.projectImage;

//res.status(404).send('create project')
    var newProject = new Project({
        projectTitle: projectTitle,
        projectClient: projectClient,
        projectDesc: projectDesc,
        projectImage: projectImage
    });

  //Check Errors
  //var errors = req.validationErrors();

        
    
    //create the project
   Project.create( newProject , function(err, project) {
        if(err) {
            console.log(err);
            res.render('500');
        } else {
            console.log(project)
        }
    });

    //success message
    req.flash('success', 'Project has been added.');

    //redirect
    res.location('/projects');
    res.redirect('/projects');

});
   

module.exports = router;