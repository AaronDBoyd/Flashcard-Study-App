const Category = require('../models/categoryModel')
const Card = require('../models/cardModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const Log = require('../../helpers/Logger')


// get all categories
const getCategories = async (req, res) => {
    const categories = await Category.find().sort({createdAt: -1})

    res.status(200).json(categories)
}

// get a category by id
const getCategoryById = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such category'})
    }

    const category = await Category.findById(id)

    if (!category) {
        return res.status(404).json({error: 'No such category'})
    }

    res.status(200).json(category)
}

// get categories by user
const getCategoriesByUser = async (req, res) => {
    //const user_id = req.user._id
    const { created_by } = req.params

    Log.info("created_by: " + JSON.stringify(req.params))

    const categories = await Category.find({ created_by }).sort({createdAt: -1})

    if (categories.length == 0) {
        Log.error("error: User has no created categories")
        return res.status(404).json({error: 'User has no created categories'})
    }

    res.status(200).json(categories)
}

// create a new category
const createCategory = async (req, res) => {
    const { title, isPrivate, color } = req.body
    const created_by_id = req.user._id

    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }

    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill out required fields', emptyFields})
    }

    // check if category already exists for user
    const exists = await Category.findOne({ title })
    if (exists && exists.title.toLowerCase() == title.toLowerCase() && exists.created_by_id == created_by_id) {
        return res.status(400).json({error: 'Category already exists'})
    }

    // find and add creator email to category
    const created_by = await User.findById({ _id: created_by_id })
    const created_by_email = created_by.email

    // add doc to db
    try{
        //const user_id = req.user._id
        const category = await Category.create({title, isPrivate, color, created_by_id, created_by_email})
        res.status(200).json(category)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// delete a category
const deleteCategory = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such category'})
    }

    const category = await Category.findOneAndDelete({_id: id})

    if (!category) {
        return res.status(404).json({error: 'No such category'})
    }

    // delete all cards that belong to the category
    const cards = await Card.deleteMany({category_id: id})
    console.log(cards)

    res.status(200).json({category: category, cardsDeleted: cards})
}

// update a category
const updateCategory = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such category'})
    }
    
    const category = await Category.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!category) {
        return res.status(404).json({error: 'No such category'})
    }

    res.status(200).json(category)
}

module.exports = {
    getCategories,
    getCategoryById,
    getCategoriesByUser,
    createCategory,
    updateCategory,
    deleteCategory
}