const express = require('express')

const router = express.Router()

// GET all categories
router.get('/', (req, res) => {
    res.json({mssg: 'GET all categories'})
})

// GET category by id
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET category by id'})
})

// GET category by user
router.get('/user/:user', (req, res) => {
    res.json({mssg: 'GET category by user'})
})

// POST new category
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new category'})
})

// DELETE a category
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a category'})
})

// UPDATE a category
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a category'})
})

module.exports = router