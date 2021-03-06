const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  // for adding select option in the html
  const sortOpts = [
    { innerText: 'A - Z', sortOpt: { name: 1 } },
    { innerText: 'Z - A', sortOpt: { name: -1 } },
    { innerText: '類別', sortOpt: { category: 1 } },
    { innerText: '地區', sortOpt: { location: 1 } },
  ]

  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort(sortOpts[0].sortOpt)
    .then(restaurants => res.render('index', { restaurants, sortOpts }))
    .catch(error => console.log(error))
})

module.exports = router
