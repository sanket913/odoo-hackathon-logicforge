const express = require('express');
const controller = require('./note.controller');
const validate = require('../../middleware/validate.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { getNotesSchema, createNoteSchema, updateNoteSchema, deleteNoteSchema } = require('./note.validation');

const router = express.Router();

router.use(protect);
router.get('/trips/:tripId/notes', validate(getNotesSchema), controller.getNotes);
router.post('/trips/:tripId/notes', validate(createNoteSchema), controller.createNote);
router.put('/notes/:id', validate(updateNoteSchema), controller.updateNote);
router.delete('/notes/:id', validate(deleteNoteSchema), controller.deleteNote);

module.exports = router;
