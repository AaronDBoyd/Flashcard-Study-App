const express = require('express')
const {
    getCards,
    getCardsByCategory,
    getCardsByUser,
    getCardsByTag,
    getCardById,
    createCard,
    updateCard,
    deleteCard
} = require('../controllers/cardController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// GET all cards
router.get('/', getCards)

// GET all cards in a category
router.get('/category/:category_id', getCardsByCategory)

// GET all cards by user
router.get('/user/:created_by', getCardsByUser)

// GET all cards by tag
router.get('/tag/:tag', getCardsByTag)

// GET card by id
router.get('/:id', getCardById)

// *** REQUIRE AUTH FOR BELOW ROUTES  ***
router.use(requireAuth)

// POST new card
router.post('/', createCard)

// DELETE a card
router.delete('/:id', deleteCard)

// UPDATE a card
router.patch('/:id', updateCard)

module.exports = router