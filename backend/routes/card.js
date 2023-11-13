const express = require('express')

const router = express.Router()

// GET all cards
router.get('/', (req, res) => {
    res.json({mssg: 'GET all cards'})
})

// GET all cards in a category
router.get('/category/:id', (req, res) => {
    res.json({mssg: 'GET all cards in a category'})
})

// GET card by id
router.get('/:id', (req, res) => {
    res.json({mssg: 'GET card by id'})
})

// POST new card
router.post('/', (req, res) => {
    res.json({mssg: 'POST a new card'})
})

// DELETE a card
router.delete('/:id', (req, res) => {
    res.json({mssg: 'DELETE a card'})
})

// UPDATE a card
router.patch('/:id', (req, res) => {
    res.json({mssg: 'UPDATE a card'})
})

module.exports = router