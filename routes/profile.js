const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Post = require('../models/Post')
const { check, validationResult } = require('express-validator')
const axios = require('axios')
const config = require('config')

const router = express.Router()
const githubClientId = config.get('githubClientId')
const githubClientSecret = config.get('githubClientSecret')

// Get current user's profile -> private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'No profile found! ' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Create or update user's profile --> private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required!').not().isEmpty(),
      check('skills', 'Skills is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).select('-__v')
        return res.json(profile)
      }

      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error!')
    }
  }
)

// Get All profiles --> public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])

    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Get profile by user id --> public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({ msg: 'No profile found!' })
    }

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'No profile found!' })
    }
    res.status(500).send('Server error!')
  }
})

// Remove profile, user & posts --> private
router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id })
    await Profile.findOneAndRemove({ user: req.user.id })
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'User removed' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Add profile experience --> private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required!').not().isEmpty(),
      check('company', 'Company is required!').not().isEmpty(),
      check('from', 'From date is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExperience)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error!')
    }
  }
)

// Delete experience from profile --> private
router.delete('/experience/:experienceId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    const currentExperience = profile.experience.map((exp) => exp)

    profile.experience = profile.experience.filter(
      (exp) => exp.id !== req.params.experienceId
    )

    if (currentExperience.length === profile.experience.length) {
      return res.status(404).json({ msg: 'No experience found!' })
    }

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Add profile education --> private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required!').not().isEmpty(),
      check('degree', 'Degree is required!').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required!').not().isEmpty(),
      check('from', 'From date is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEducation)

      await profile.save()

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error!')
    }
  }
)

// Delete education from profile --> private
router.delete('/education/:educationId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    const currentEducation = profile.education.map((exp) => exp)

    profile.education = profile.education.filter(
      (exp) => exp.id !== req.params.educationId
    )

    if (currentEducation.length === profile.education.length) {
      return res.status(404).json({ msg: 'No education found!' })
    }

    await profile.save()

    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Get user repos from github
router.get('/github/:username', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
    )

    res.json(response.data)
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ msg: 'No github profile found!' })
  }
})

module.exports = router
