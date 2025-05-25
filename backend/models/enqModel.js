const mongoose = require('mongoose');

const enqSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Submitted",
        enum: ["Submitted", "Contacted", "In Progress"],
    },
    feedback: {
        type: String,
        default: "",   
    }
});

module.exports = mongoose.model('Enquiry', enqSchema);
