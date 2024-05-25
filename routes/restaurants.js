const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant


// Retrieve all restaurants from the database
router.get('/', async (req, res, next) => {
    try {
        const sortOption = req.query.sort
        let sortCondition = []
        switch (sortOption) {
            case 'aToz':
                sortCondition = [['name', 'ASC']]
                break
            case 'zToa':
                sortCondition = [['name', 'DESC']]
                break
            case 'category':
                sortCondition = [['category', 'ASC']]
                break
            case 'location':
                sortCondition = [['location', 'ASC']]
                break
            case 'rating':
                sortCondition = [['rating', 'DESC']]
                break
            default:
                sortCondition = [['name', 'ASC']]
        }

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
            order: sortCondition,
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
        res.render('index', { restaurants: matchedRestaurants, keyword: keyword, sort: sortOption})
    } catch (error) {
        next(error)
    }
})

router.get('/new', (req, res, next) => {
    try {
        res.render('new')
    } catch (error) {
        next(error)
    }
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
    } catch (error) {
        next(error)
    }
})

router.post('/', async(req, res, next) => {
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
        req.flash('success', '建立成功')
        res.redirect('/restaurants')
    } catch (error) {
        error.errorMessage('資料取得失敗')
        next(error)
    }
})

router.put('/:id/', async (req, res, next) => {
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
        req.flash('success', '修改成功')
        res.redirect('/restaurants')
    } catch (error) {
        error.errorMessage('新增失敗')
        next(error)
    }
})


router.get('/:id', async (req, res, next) => {
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
    } catch (error) {
        error.errorMessage('資料取得失敗')
        next(error)
    }
})


router.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        await Restaurant.destroy({
            where: {
                id: id
            }
        })
        req.flash('success', '刪除成功')
        res.redirect('/restaurants')
    } catch (error) {
        next(error)
    }
})

module.exports = router