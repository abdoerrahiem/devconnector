const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const Post = require('../models/Post')
const Profile = require('../models/Profile')

// Create a post --> private
router.post(
  '/',
  [auth, [check('text', 'Text is required!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      })

      const post = await newPost.save()

      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error!')
    }
  }
)

// Get all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })

    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error!')
  }
})

// Get post by ID --> private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' })
    }

    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found!' })
    }
    res.status(500).send('Server error!')
  }
})

// Delete post by ID --> private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' })
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized!' })
    }

    await post.remove()

    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found!' })
    }
    res.status(500).send('Server error!')
  }
})

// Like a post --> private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' })
    }

    const liked = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    )
    if (liked.length > 0) {
      return res.status(400).json({ msg: 'Post already liked!' })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found!' })
    }
    res.status(500).send('Server error!')
  }
})

// Unlike a post --> private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' })
    }

    const liked = post.likes.filter(
      (like) => like.user.toString() === req.user.id
    )

    if (liked.length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked!' })
    }

    post.likes = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    )

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found!' })
    }
    res.status(500).send('Server error!')
  }
})

// Comment a post --> private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required!').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)

      if (!post) {
        return res.status(404).json({ msg: 'Post not found!' })
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      }

      post.comments.unshift(newComment)

      await post.save()

      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Post not found!' })
      }
      res.status(500).send('Server error!')
    }
  }
)

// Delete comment
router.delete('/comment/:id/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ msg: 'Post not found!' })
    }

    const comment = post.comments.find(
      (comment) => comment.id === req.params.commentId
    )

    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist!' })
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized!' })
    }

    post.comments = post.comments.filter(
      (comment) => comment.id.toString() !== req.params.commentId
    )

    await post.save()

    res.json(post.comments)
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found!' })
    }
    res.status(500).send('Server error!')
  }
})

module.exports = router
