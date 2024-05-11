const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// const restaurants = require('./public/jsons/restaurant.json').results

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))



app.get('/',(req, res) => {
    res.redirect('/restaurants')
})

// Retrieve all restaurants from the database
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({
            attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'rating', 'description'],
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


app.get('/restaurant/:id', async (req, res) => {
    const id = req.params.id
    return await Restaurant.findByPk(id, {
        attributes: ['id', 'name', 'name_en','phone', 'category', 'image', 'location', 'rating', 'description'],
        raw: true
    })
        .then((selectedRestaurant) => res.render('show', {selectedRestaurant: selectedRestaurant}))
        .catch((err) => console.log(err))
})


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})