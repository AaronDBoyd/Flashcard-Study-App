const Category = require('../models/categoryModel')
const mongoose = require('mongoose')
const Log = require('../../helpers/logHelper')


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
    //const { title, created_by, private, color } = req.body
    const { title, private, color } = req.body
    const created_by = req.user._id

    let emptyFields = []

    if(!title) {
        emptyFields.push('title')
    }
    // if(!created_by){
    //     emptyFields.push('created_by')
    // }
    // if(!private) {
    //     emptyFields.push('private')
    // }
    // if(!color){
    //     emptyFields.push('color')
    // }
    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill out required fields', emptyFields})
    }

    // add doc to db
    try{
        //const user_id = req.user._id
        const category = await Category.create({title, created_by, private, color})
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

    res.status(200).json(category)
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