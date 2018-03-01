// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({ site_id: process.env.TURBO_APP_ID })
const vertex = require('vertex360')({ site_id: process.env.TURBO_APP_ID })
const router = vertex.router()
const utils = require('./utils')

router.get('/', (req, res) => {
  const data = {
    text: 'PhotoBomb',
    greeting: 'Welcome',
    cdn: process.env.TURBO_CDN
  }

  res.render('index', data)
})

router.get('/:username', (req, res) => {
  const username = req.params.username
  const instagramAPI = 'https://www.instagram.com/' + username + '/?__a=1'

  utils.HTTP.get(instagramAPI, null)
    .then(data => {
      data['cdn'] = process.env.TURBO_CDN
      res.render('index', data)
    })
    .catch(err => {
      const data = {
        message: err.message || 'Check your spelling!'
      }

      data['cdn'] = process.env.TURBO_CDN
      res.render('error', data)
    })
})

router.get('/:username/:postcode', (req, res) => {
  const username = req.params.username
  const postcode = req.params.postcode

  const instagramAPI = 'https://www.instagram.com/' + username + '/?__a=1'

  utils.HTTP.get(instagramAPI, null)
    .then(data => {
      const user = data.user
      const posts = user.media.nodes
      let selectedPost = null

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]
        if (post.code == postcode) {
          selectedPost = post
          break
        }
      }

      if (selectedPost == null) {
        throw new Error('Post not found!')
        return
      }

      selectedPost['user'] = {
        username: user.username,
        icon: user.profile_pic_url
      }

      selectedPost['cdn'] = process.env.TURBO_CDN
      res.render('post', selectedPost)
      return
    })
    .catch(err => {
      const data = {
        message: err.message || 'Check your spelling!'
      }

      data['cdn'] = process.env.TURBO_CDN
      res.render('error', data)
      return
    })
})

module.exports = router
