const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash  = require('connect-flash')
const messageHandler = require('./middleware/message-handler')
const errorHandler = require('./middleware/error-handler')
const router = require('./routes')


const app = express()
const port = 3000
// const restaurants = require('./public/jsons/restaurant.json').results


app.engine('.hbs', engine({ 
    extname: '.hbs',
    helpers: {
        equal: (v1, v2) => {
            return v1 === v2
        },
        range: (start, end) => {
            let array = []
            for (let i = start; i <= end; i++) {
                array.push(i)
            }
            return array
        },
        gt: (v1, v2) => v1 > v2,
        lt: (v1, v2) => v1 < v2,
        increment: (value) => parseInt(value) + 1,
        decrement: (value) => parseInt(value) - 1,

    }

}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(session({
    secret: 'ThisIsSecret',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())
app.use(messageHandler)
app.use(router)
app.use(errorHandler)


app.listen(port, () => {
    console.log(`express server is running on http://localhost:${port}`)
})