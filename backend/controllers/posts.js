const expressAsyncHandler = require('express-async-handler')
const db = require('../config/db')

// Create post
exports.createPost = expressAsyncHandler(async (req, res) => {
  const { text } = req.body

  const user = await db('users')
    .where({ id: req.user.id })
    .select('name', 'avatar')
    .first()

  const post = await db('posts').insert({
    text,
    name: user.name,
    avatar: user.avatar,
    userId: req.user.id,
  })

  const createdPost = await db('posts').where({ id: post }).first()

  res.status(201).json({
    success: true,
    message: 'Post berhasil dibuat.',
    data: createdPost,
  })
})

// Get posts
exports.getPosts = expressAsyncHandler(async (req, res) => {
  const posts = await db('posts')
    .innerJoin('users', {
      'posts.userId': 'users.id',
    })
    .select(
      { id: 'posts.id' },
      'userId',
      'text',
      { name: 'posts.name' },
      { avatar: 'posts.avatar' },
      'username',
      'email',
      'created_at'
    )

  res.json({ success: true, count: posts.length, data: posts })
})

// Get post
exports.getPost = expressAsyncHandler(async (req, res) => {
  const post = await db('posts').where({ id: req.params.id }).first()
  if (!post) {
    res.status(404)
    throw new Error('Post tidak ditemukan.')
  }

  res.json({ success: true, data: post })
})

// Delete post
exports.deletePost = expressAsyncHandler(async (req, res) => {
  const post = await db('posts')
    .where({ id: req.params.id, userId: req.user.id })
    .del()

  if (!post) {
    res.status(404)
    throw new Error('Post tidak ditemukan.')
  }

  res.json({ success: true, message: 'Post berhasil dihapus.' })
})

// Add like to post
exports.addLikeToPost = expressAsyncHandler(async (req, res) => {
  const post = await db('posts').where({ id: req.params.id }).first()
  if (!post) {
    res.status(404)
    throw new Error('Post tidak ditemukan.')
  }

  const alreadyLiked = await db('likes').where({ userId: req.user.id }).first()
  if (alreadyLiked) {
    res.status(400)
    throw new Error('Kamu telah menyukai post ini.')
  }

  const like = await db('likes').insert({
    postId: post.id,
    userId: req.user.id,
  })

  const likedPost = await db('likes').where({ id: like }).first()

  res.status(401).json({
    success: true,
    message: 'Like berhasil ditambahkan',
    data: likedPost,
  })
})

// Unlike post
exports.unlikePost = expressAsyncHandler(async (req, res) => {
  const post = await db('posts').where({ id: req.params.id }).first()
  if (!post) {
    res.status(404)
    throw new Error('Post tidak ditemukan.')
  }

  const alreadyLiked = await db('likes').where({ userId: req.user.id }).del()
  if (!alreadyLiked) {
    res.status(400)
    throw new Error('Anda belum menyukai post ini.')
  }

  res.status(401).json({
    success: true,
    message: 'Unlike berhasil.',
  })
})

// Get like by post
exports.getLikes = expressAsyncHandler(async (req, res) => {
  const likes = await db('likes')
    .where({ postId: req.params.id })
    .join('users', { 'likes.userId': 'users.id' })
    .select('name', 'username', 'avatar')

  res.json({ success: true, count: likes.length, data: likes })
})

// Add comment to post
exports.addCommentToPost = expressAsyncHandler(async (req, res) => {
  const post = await db('posts').where({ id: req.params.id }).first()
  if (!post) {
    res.status(404)
    throw new Error('Post tidak ditemukan.')
  }

  const comment = await db('comments').insert({
    postId: post.id,
    userId: req.user.id,
    text: req.body.text,
    name: req.user.name,
    avatar: req.user.avatar,
  })

  const commentedPost = await db('comments').where({ id: comment }).first()

  res.status(401).json({
    success: true,
    message: 'Komentar berhasil ditambahkan',
    data: commentedPost,
  })
})

// Get comments by post
exports.getComments = expressAsyncHandler(async (req, res) => {
  const comments = await db('comments').where({ postId: req.params.id })

  res.json({ success: true, count: comments.length, data: comments })
})

// Delete comment
exports.deleteComment = expressAsyncHandler(async (req, res) => {
  const post = await db('posts').where({ id: req.params.id }).first()
  if (!post) {
    res.status(404)
    throw new Error('Post tidak ditemukan.')
  }

  const comment = await db('comments')
    .where({ id: req.query.id, userId: req.user.id })
    .del()
  if (!comment) {
    res.status(404)
    throw new Error('Komentar tidak ditemukan.')
  }

  res.status(401).json({
    success: true,
    message: 'Komentar berhasil dihapus.',
  })
})
