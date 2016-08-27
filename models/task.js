var mongoose = require('mongoose');

var TaskSchema = mongoose.Schema ({
    name: {
        type: String
    }
});

var Task = mongoose.model( 'tasks', TaskSchema );
module.exports = Task;