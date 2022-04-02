const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const noteSchema = new Schema({
    content: String,
    date: Date,
    important: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

const Note = model('Note', noteSchema);

module.exports = Note;



// Note.find({}).then(result => {
//     console.log(result);
//     mongoose.connection.close();
// });

// const note = new Note({
//     content: 'MongoDb es fino dani',
//     date: new Date(),
//     important: true
// });

// note.save()
//     .then(result => {
//         console.log(result);
//         mongoose.connection.close();
//     })
//     .catch(err => {
//         console.log(err);
//     });
