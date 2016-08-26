var mongoose = require('mongoose');

var ProjectSchema = mongoose.Schema ({
    projectImage: {
        type: String
    },
    projectTitle: {
        type: String,
        required: true,
        default: ""
    },
    projectClient: {
        type: String,
        required: true,
        default: ""
    },
    projectDesc: {
        type: String
    }
});

var Project = mongoose.model( 'projects', ProjectSchema );
module.exports = Project;