const Card = require('../models/cardModel')
const Category = require('../models/categoryModel')
const mongoose = require('mongoose')
const Log = require('../../helpers/Logger')


// get all flash cards
const getCards = async (req, res) => {
    const cards = await Card.find({}).sort({createdAt: -1})

    res.status(200).json(cards)
}

// get all cards in a category
const getCardsByCategory = async (req, res) => {
    const { category_id } = req.params

    const cards = await Card.find({ category_id }).sort({createdAt: -1})

    if (cards.length == 0) {
        Log.error("error: Category has no created cards")
        return res.status(404).json({error: 'Category has no created cards'})
    }

    res.status(200).json(cards)
}

// get all cards by User
const getCardsByUser = async (req, res) => {
    const { created_by } = req.params

    const cards = await Card.find({ created_by }).sort({createdAt: -1})

    if (cards.length == 0) {
        Log.error("error: User has no created cards")
        return res.status(404).json({error: 'User has no created cards'})
    }

    res.status(200).json(cards)
}

// get all cards by tag
const getCardsByTag = async (req, res) => {
    const { tag } = req.params

    const cards = await Card.find({ tags: tag }).sort({createdAt: -1})

    if (cards.length == 0) {
        Log.error("error: User has no created cards")
        return res.status(404).json({error: 'User has no created cards'})
    }

    res.status(200).json(cards)
}

// get a card by id
const getCardById = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such card'})
    }

    const card = await Card.findById(id)

    if (!card) {
        return res.status(404).json({error: 'No such card'})
    }

    res.status(200).json(card)
}

// create a new card
const createCard = async (req, res) => {
    const {question, answer, category_id, multiple_choice, tags} = req.body

    Log.info( JSON.stringify(req.body) )

    let emptyFields = []

    if(!question) {
        emptyFields.push('question')
    }
    if(!answer) {
        emptyFields.push('answer')
    }
    if(!category_id) {
        emptyFields.push('category_id')
    }
    if(emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }
    
    // increment card count of category
    const category = await Category.findById({_id: category_id})
    const cardCount = category.card_count + 1
    await Category.findByIdAndUpdate({_id: category_id}, {
        card_count: cardCount
    })

    // add doc to db
    try{
        const created_by = req.user._id
        const card = await Card.create({question, answer, category_id, multiple_choice, tags, created_by})
        res.status(200).json(card)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// update a card
const updateCard = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such card'})
    }

    const card = await Card.findByIdAndUpdate({_id: id}, {
        ...req.body
    })

    if (!card) {
        return res.status(404).json({error: 'No such card'})
    }

    res.status(200).json(card)
}

// delete a card
const deleteCard = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such card'})
    }

    const card = await Card.findByIdAndDelete({_id: id})

    if (!card) {
        return res.status(404).json({error: 'No such card'})
    }

    // decrement card count of category
    const category = await Category.findById({_id: card.category_id})
    const cardCount = category.card_count - 1
    await Category.findByIdAndUpdate({_id: category._id}, {
        card_count: cardCount
    })

    res.status(200).json(card)
}


module.exports = {
    getCards,
    getCardsByCategory,
    getCardsByUser,
    getCardsByTag,
    getCardById,
    createCard,
    updateCard,
    deleteCard
}