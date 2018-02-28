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
        res.json({
          confirmation: 'fail',
          message: err.message
        })
        return
      }

      res.render('index', response.body)
      //res.json({
      //  confirmation: 'success',
      //  data: response.body
      //})
    })
})

module.exports = router
