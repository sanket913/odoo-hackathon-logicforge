const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/users/user.routes');
const tripRoutes = require('../modules/trips/trip.routes');
const stopRoutes = require('../modules/stops/stop.routes');
const activityRoutes = require('../modules/activities/activity.routes');
const cityRoutes = require('../modules/cities/city.routes');
const budgetRoutes = require('../modules/budgets/budget.routes');
const checklistRoutes = require('../modules/checklist/checklist.routes');
const noteRoutes = require('../modules/notes/note.routes');
const aiRoutes = require('../modules/ai/ai.routes');
const sharingRoutes = require('../modules/sharing/sharing.routes');
const adminRoutes = require('../modules/admin/admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use(stopRoutes);
router.use(activityRoutes);
router.use(cityRoutes);
router.use(budgetRoutes);
router.use(checklistRoutes);
router.use(noteRoutes);
router.use(aiRoutes);
router.use(sharingRoutes);
router.use(adminRoutes);

module.exports = router;
