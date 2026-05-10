const { z } = require('zod');

const tripIdParams = z.object({ tripId: z.string().min(1) });
const idParams = z.object({ id: z.string().min(1) });

const noteBody = {
  stopId: z.string().min(1).nullable().optional(),
  title: z.string().trim().min(1).max(160).nullable().optional(),
  content: z.string().trim().min(1).max(10000)
};

const getNotesSchema = z.object({ params: tripIdParams });
const createNoteSchema = z.object({ params: tripIdParams, body: z.object(noteBody) });
const updateNoteSchema = z.object({
  params: idParams,
  body: z.object({
    stopId: noteBody.stopId,
    title: noteBody.title,
    content: noteBody.content.optional()
  }).refine((data) => Object.keys(data).length > 0, 'At least one field is required')
});
const deleteNoteSchema = z.object({ params: idParams });

module.exports = { getNotesSchema, createNoteSchema, updateNoteSchema, deleteNoteSchema };
