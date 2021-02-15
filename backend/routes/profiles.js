const router = require('express').Router()
const {
  createProfile,
  getCurrentUser,
  getProfiles,
  getProfile,
  deleteProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  getUserRepos,
} = require('../controllers/profiles')
const { auth } = require('../middlewares')

router.route('/github/:username').get(getUserRepos)
router.route('/me').get(auth, getCurrentUser)
router
  .route('/')
  .post(auth, createProfile)
  .get(getProfiles)
  .delete(auth, deleteProfile)
router.route('/experiences/:id').delete(auth, deleteExperience)
router.route('/educations/:id').delete(auth, deleteEducation)
router.route('/:id/experiences').post(auth, addExperience)
router.route('/:id/educations').post(auth, addEducation)
router.route('/:id').get(getProfile)

module.exports = router
