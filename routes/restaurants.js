const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant


// Retrieve all restaurants from the database
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({
            attributes: [
                'id',
                'name',
                'name_en',
                'category',
                'image',
                'location',
                'rating',
            ],
            raw: true
        })
        // Get the keyword from the query parameter and trim it
        const keyword = req.query.keyword?.trim().toLocaleLowerCase()

        // Filter the restaurants based on the keyword
        const matchedRestaurants = keyword ? restaurants.filter((restaurant) => {
            const restaurantName = [restaurant.name, restaurant.name_en]
            return restaurantName.some(name => name.toLocaleLowerCase().includes(keyword))
        }) : restaurants

        // Render the 'index' view with the matched restaurants and keyword
        res.render('index', { restaurants: matchedRestaurants, keyword: keyword })
    } catch (err) {
        console.log(err)
    }
})

router.get('/new', (req, res) => {
    return res.render('new')
})

router.get('/:id/edit', async (req, res) => {
    const id = req.params.id
    try {
        const selectedRestaurant = await Restaurant.findByPk(id, {
            attributes: [
                'id',
                'name',
                'name_en',
                'phone',
                'category',
                'image',
                'location',
                'google_map',
                'rating',
                'description'
            ],
            raw: true
        })
        if (!selectedRestaurant) {
            res.status(404).send('Restaurant not found')
            return
        }
        res.render('edit', { restaurant: selectedRestaurant })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

router.post('/', async(req, res) => {
    const restaurantBody = req.body
    console.log(restaurantBody)
    try {
        await Restaurant.create({
            name: restaurantBody.name,
            name_en: restaurantBody.name_en || null,
            category: restaurantBody.category || null,
            location: restaurantBody.location || null,
            image: restaurantBody.image || null,
            phone: restaurantBody.phone || null,
            google_map: restaurantBody.google_map || null,
            rating: restaurantBody.rating || null,
            description: restaurantBody.description || null,
        })
        res.redirect('/restaurants')
    } catch (err) {
        console.log(err)
    }
})

router.put('/:id/', async (req, res) => {
    const id = req.params.id
    const restaurantBody = req.body
    try {
        await Restaurant.update({
            name: restaurantBody.name,
            name_en: restaurantBody.name_en || null,
            category: restaurantBody.category || null,
            location: restaurantBody.location || null,
            image: restaurantBody.image || null,
            phone: restaurantBody.phone || null,
            google_map: restaurantBody.google_map || null,
            rating: restaurantBody.rating || null,
            description: restaurantBody.description || null,
        }, { where: { id } }
        )
        res.redirect('/restaurants')
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})


router.get('/:id', async (req, res) => {
    const id = req.params.id
    console.log(`this ${{id}}`)
    try {
        const selectedRestaurant = await Restaurant.findByPk(id, {
            attributes: [
                'id',
                'name',
                'name_en',
                'phone',
                'category',
                'image',
                'location',
                'google_map',
                'rating',
                'description'
            ],
            raw: true
        })
        res.render('show', { selectedRestaurant })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})


router.delete('/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Restaurant.destroy({
            where: {
                id: id
            }
        })
        res.redirect('/restaurants')
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

module.exports = router