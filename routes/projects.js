var express = require('express');
var router = express.Router();
var multer = require('multer'),
	bodyParser = require('body-parser'),
	path = require('path');
//handle file uploads - setting destination of where to load

var upload = multer({ dest: './uploads/projects/'});
//links to project.js
var Project = require('../models/project');

router.get('/', function (req, res, next) {
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
router.get('/add', function(req, res, next) {
    //create new project
  res.render('projects/add');
});

router.post('/add', upload.single('projectImage'), function (req, res, next) {
    var projectTitle = req.body.projectTitle;
    var projectClient = req.body.projectClient;
    var projectDesc = req.body.projectDesc;
    var projectImage = req.body.projectImage;

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
            res.render('/add', {
            errors: errors
        });
        } else {
            console.log(project);
        }
    });

    //success message
    req.flash('success', 'Project has been added.');

    //redirect
   //res.location('/projects/add');
    //res.redirect('/projects');

});
   

module.exports = router;