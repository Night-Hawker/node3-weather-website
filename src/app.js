const hbs = require('hbs')
const path = require('path')
const express = require('express')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

// Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index',{
        title: 'Weather',
        name: 'Aung Pyae Maung'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name:'Aung Pyae Maung'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        helpText:'This is some helpful text',
        title:'Help',
        name:'Aung Pyae Maung'
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Aung Pyae Maung',
        errorMessage:'Help article not found'
    })
})

app.get('/weather',(req, res)=>{
    if (!req.query.address){
        return res.send({
            error: 'You must provide an address'
        })
    } else {
        geocode(req.query.address, (error,{latitude, longitude, location} = {})=>{
            if (error){
                return res.send({ error })
            }   
        
            forecast(latitude, longitude, (error,forecastData)=>{
                if (error){
                    return res.send({ error })
                }
                res.send({
                    forecast:forecastData,
                    location,
                    address:req.query.address
                })
            })
        })
    }
})

app.get('/products',(req,res)=>{
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[] 
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Aung Pyae Maung',
        errorMessage:'My 404 Page'
    })
})
app.listen(3000, ()=>{
    console.log('Server is up on the port 3000!')
})