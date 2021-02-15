const router = require('express').Router()
const {
  createPost,
  getPosts,
  getPost,
  deletePost,
  addLikeToPost,
  unlikePost,
  getLikes,
  addCommentToPost,
  getComments,
  deleteComment,
} = require('../controllers/posts')
const { auth } = require('../middlewares')

router.route('/').post(auth, createPost).get(getPosts)
router.route('/:id').get(getPost).delete(auth, deletePost)
router
  .route('/:id/like')
  .post(auth, addLikeToPost)
  .delete(auth, unlikePost)
  .get(getLikes)
router
  .route('/:id/comment')
  .post(auth, addCommentToPost)
  .get(getComments)
  .delete(auth, deleteComment)

module.exports = router
