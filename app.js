const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))



app.get('/',(req, res) => {
    res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) =>{
    const keyword = req.query.keyword?.trim()
    const matchedRestaurant = keyword ? restaurants.filter((restaurant) =>
        Object.values(restaurant).some((property) => {
            if (typeof property === 'string') {
                return property.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
            }
            return false
        })
    ) : restaurants
    res.render('index', {restaurants: matchedRestaurant, keyword:keyword})
})

app.get('/restaurant/:id', (req, res) => {
    const id = req.params.id
    const selectedRestaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
    res.render('show', {selectedRestaurant: selectedRestaurant})
})


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})