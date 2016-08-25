var mongoose = require('mongoose');

var schema = mongoose.Schema ({
    projectImage: {
        type: String
    },
    projectTitle: {
        type: String,
        default: ""
    },
    projectClient: {
        type: String,
        default: ""
    },
    projectDesc: {
        type: String
    }
});

var Project = mongoose.model( 'projects', schema );
module.exports = Project;