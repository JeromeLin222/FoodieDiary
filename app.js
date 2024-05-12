const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const port = 3000
// const restaurants = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))


app.get('/',(req, res) => {
    res.redirect('/restaurants')
})

// Retrieve all restaurants from the database
app.get('/restaurants', async (req, res) => {
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
        const matchedRestaurant = keyword ? restaurants.filter((restaurant) => {
            const restaurantName = [restaurant.name, restaurant.name_en]
            return restaurantName.some(name => name.toLocaleLowerCase().includes(keyword))
        }) : restaurants

        // Render the 'index' view with the matched restaurants and keyword
        res.render('index', {restaurants: matchedRestaurant, keyword: keyword})
    } catch (err) {
        console.log(err)
    }
})

app.get('/restaurants/new', (req, res) => {
    return res.render('new',{test: 'create'})
})

app.get('/restaurants/:id/edit', async (req, res) => {
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
        res.render('edit', {restaurant: selectedRestaurant})
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})

app.put('/restaurants/:id/', async (req, res) => {
    console.log(req.body)
    console.log(req.body.category)
    const id = req.params.id
    const restaurantBody = req.body
    try {
        const [affectedCount, affectedRows] = await Restaurant.update(
            {
            name: restaurantBody.name,
            name_en: restaurantBody.name_en,
            category: restaurantBody.category,
            location: restaurantBody.location,
            image: restaurantBody.image,
            phone: restaurantBody.phone,
            google_map: restaurantBody.google_map,
            rating: restaurantBody.rating,
            description: restaurantBody.description
            },
            { where: { id: id } }
        )
        res.redirect('/restaurants')
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})


app.get('/restaurant/:id', async (req, res) => {
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
        res.render('show', {selectedRestaurant})
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
})


app.delete('/restaurants/:id', async (req, res) => {
    const id = req.params.id
    // console.log('delete: ', id)
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


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})