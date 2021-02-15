const expressAsyncHandler = require('express-async-handler')
const fetch = require('node-fetch')
const db = require('../config/db')

// Get current user profile
exports.getCurrentUser = expressAsyncHandler(async (req, res) => {
  const profile = await db('profiles').where({ userId: req.user.id }).first()
  if (!profile) {
    res.status(404)
    throw new Error('Profil tidak ditemukan.')
  }

  const social = await db('socials')
    .where({ profileId: profile.id })
    .join('users', { 'socials.userId': 'users.id' })
    .join('profiles', { 'socials.profileId': 'profiles.id' })
    .select(
      { userId: 'socials.userId' },
      'name',
      'email',
      'avatar',
      'youtube',
      'twitter',
      'facebook',
      'linkedin',
      'instagram',
      'company',
      'website',
      'location',
      'status',
      'skills',
      'bio',
      'githubusername'
    )
    .first()

  res.json({ success: true, data: social })
})

// Create / update profile
exports.createProfile = expressAsyncHandler(async (req, res) => {
  const {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
  } = req.body

  const existedProfile = await db('profiles')
    .where({ userId: req.user.id })
    .first()
  if (existedProfile) {
    const profile = await db('profiles').where({ userId: req.user.id }).update({
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
    })

    const updatedProfile = await db('profiles')
      .where({ userId: req.user.id })
      .first()

    await db('socials').where({ profileId: updatedProfile.id }).update({
      userId: req.user.id,
      profileId: updatedProfile.id,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    })

    await db('socials').where({ profileId: updatedProfile.id }).first()

    res.status(401).json({
      success: true,
      message: 'Profile berhasil diperbaharui.',
    })
  } else {
    const profile = await db('profiles').insert({
      userId: req.user.id,
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
    })

    const social = await db('socials').insert({
      userId: req.user.id,
      profileId: profile,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    })

    await db('profiles').where({ id: profile }).first()
    await db('socials').where({ id: social }).first()

    res.status(401).json({
      success: true,
      message: 'Profile berhasil dibuat.',
    })
  }
})

// Get profiles
exports.getProfiles = expressAsyncHandler(async (req, res) => {
  const profiles = await db('profiles')
    .join('users', { 'profiles.userId': 'users.id' })
    .select(
      'name',
      'email',
      'avatar',
      'userId',
      'company',
      'website',
      'location',
      'status',
      'skills',
      'bio',
      'githubusername'
    )

  res.json({ success: true, data: profiles })
})

// Get profile
exports.getProfile = expressAsyncHandler(async (req, res) => {
  const profile = await db('profiles').where({ userId: req.params.id }).first()
  if (!profile) {
    res.status(404)
    throw new Error('Profil tidak ditemukan.')
  }

  const social = await db('socials')
    .where({ profileId: profile.id })
    .join('users', { 'socials.userId': 'users.id' })
    .join('profiles', { 'socials.profileId': 'profiles.id' })
    .select(
      'name',
      'email',
      'avatar',
      'youtube',
      'twitter',
      'facebook',
      'linkedin',
      'instagram',
      'company',
      'website',
      'location',
      'status',
      'skills',
      'bio',
      'githubusername'
    )
    .first()

  res.json({ success: true, data: social })
})

// Delete profile
exports.deleteProfile = expressAsyncHandler(async (req, res) => {
  await db('socials').where({ userId: req.user.id }).del()
  await db('likes').where({ userId: req.user.id }).del()
  await db('comments').where({ userId: req.user.id }).del()
  await db('posts').where({ userId: req.user.id }).del()
  await db('profiles').where({ userId: req.user.id }).del()
  await db('users').where({ id: req.user.id }).del()

  res.json({ success: true, message: 'User berhasil dihapus.' })
})

// Add experience
exports.addExperience = expressAsyncHandler(async (req, res) => {
  const { title, company, location, from, to, current, description } = req.body

  const experience = await db('experiences').insert({
    userId: req.user.id,
    profileId: req.params.id,
    title,
    company,
    location,
    from,
    to,
    current,
    description,
  })

  const createdExperience = await db('experiences')
    .where({ id: experience })
    .first()

  res.status(201).json({
    success: true,
    message: 'Experience berhasil ditambahkan.',
    data: createdExperience,
  })
})

// Delete experience
exports.deleteExperience = expressAsyncHandler(async (req, res) => {
  const experience = await db('experiences')
    .where({ id: req.params.id, userId: req.user.id })
    .del()
  if (!experience) {
    res.status(404)
    throw new Error('Experience tidak ditemukan.')
  }

  res.status(200).json({
    success: true,
    message: 'Experience berhasil dihapus.',
  })
})

// Add education
exports.addEducation = expressAsyncHandler(async (req, res) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  } = req.body

  const education = await db('educations').insert({
    userId: req.user.id,
    profileId: req.params.id,
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  })

  const createdEducation = await db('educations')
    .where({ id: education })
    .first()

  res.status(201).json({
    success: true,
    message: 'Education berhasil ditambahkan.',
    data: createdEducation,
  })
})

// Delete education
exports.deleteEducation = expressAsyncHandler(async (req, res) => {
  const education = await db('educations')
    .where({ id: req.params.id, userId: req.user.id })
    .del()
  if (!education) {
    res.status(404)
    throw new Error('Education tidak ditemukan.')
  }

  res.status(200).json({
    success: true,
    message: 'Education berhasil dihapus.',
  })
})

// Get user repos from github
exports.getUserRepos = expressAsyncHandler(async (req, res) => {
  try {
    fetch(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0)
          return res
            .status(404)
            .json({ success: false, message: 'Profil github tidak ditemukan.' })

        res.json({ success: true, count: data.length, data })
      })
  } catch (error) {
    res.json({ success: true, error })
  }
})
