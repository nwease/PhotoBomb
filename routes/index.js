// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({ site_id: process.env.TURBO_APP_ID })
const vertex = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const router = vertex.router()
const superagent = require('superagent')

router.get('/', (req, res) => {
  const data = {
    text: 'PhotoBomb',
    greeting: 'Welcome'
  }

  res.render('index', data)
})

router.get('/:username', (req, res) => {
  const username = req.params.username
  const instagramAPI = 'https://www.instagram.com/' + username + '/?__a=1'

  superagent
    .get(instagramAPI)
    .query(null)
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err) {
        const data = {
          message: err.message || 'Check your spelling!'
        }
        res.render('error', data)
        return
      }

      res.render('index', response.body)
    })
})

router.get('/:username/:postcode', (req, res) => {
  const username = req.params.username
  const postcode = req.params.postcode

  const instagramAPI = 'https://www.instagram.com/' + username + '/?__a=1'

  superagent
    .get(instagramAPI)
    .query(null)
    .set('Accept', 'application/json')
    .end((err, response) => {
      if (err) {
        const data = {
          message: err.message || 'Check your spelling!'
        }
        res.render('error', data)
        return
      }

      const posts = response.body.user.media.nodes
      let selectedPost = null

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        if (post.code == postcode) {
          selectedPost = post
          break
        }
      }

      if (selectedPost == null) {
        res.render('error', { message: 'Post not found!' })
        return
      }

      res.render('post', selectedPost)

      //res.json({
      //  confirmation: 'success',
      //  data: selectedPost
      //})
    })
})

module.exports = router
