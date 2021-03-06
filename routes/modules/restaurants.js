const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// render search restaurants
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  let querySort = req.query.sort
  const sortOpts = [
    { innerText: 'A - Z', sortOpt: { name: 1 } },
    { innerText: 'Z - A', sortOpt: { name: -1 } },
    { innerText: '類別', sortOpt: { category: 1 } },
    { innerText: '地區', sortOpt: { location: 1 } },
  ]

  sortOpts.find(sort => sort.innerText === querySort).selected = 'selected'
  let sortOpt = sortOpts.find(sort => sort.innerText === querySort).sortOpt

  const userId = req.user._id
  return Restaurant.find({ userId })
    .lean()
    .sort(sortOpt)
    .then(restaurants =>
      restaurants.filter(
        restaurant =>
          restaurant.name.trim().toLowerCase().includes(keyword) ||
          restaurant.name_en.trim().toLowerCase().includes(keyword)
      )
    )
    .then(searchRestaurants =>
      res.render('index', {
        restaurants: searchRestaurants,
        keyword,
        sortOpts,
      })
    )
})

// render new page for adding restaurant
router.get('/new', (req, res) => {
  res.render('new')
})

// add new restaurant
router.post('/', (req, res) => {
  const userId = req.user._id
  const restaurant = req.body
  restaurant.userId = userId // restaurant['userId'] = userId
  return Restaurant.create(restaurant)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// render detail page of restaurant
router.get('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const restaurantId = req.params.restaurant_id
  return Restaurant.findOne({ _id: restaurantId, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// render edit page of restaurant
router.get('/:restaurant_id/edit', (req, res) => {
  const userId = req.user._id
  const restaurantId = req.params.restaurant_id
  return Restaurant.findOne({ _id: restaurantId, userId })
    .lean()
    .then(restaurant => {
      res.render('edit', { restaurant })
    })
    .catch(error => console.log(error))
})

// update restaurant information
router.put('/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  const userId = req.user._id
  const restaurant = req.body
  return Restaurant.findOneAndUpdate({ _id: restaurantId, userId }, restaurant)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch(error => console.log(error))
})

// delete restaurant
router.delete('/:restaurant_id', (req, res) => {
  const restaurantId = req.params.restaurant_id
  // const userId = req.user._id
  // return Restaurant.findOneAndDelete({_id,userId})
  return Restaurant.findByIdAndDelete({ _id: restaurantId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router
