const express = require('express')
const {
    getCategories,
    getCategoryById,
    getCategoriesByUser,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// GET all categories
router.get('/', getCategories)

// GET category by id
router.get('/:id', getCategoryById)

// *** REQUIRE AUTH FOR BELOW ROUTES  ***
router.use(requireAuth)

// GET categories by creator
router.get('/user/:created_by', getCategoriesByUser)

// POST new category
router.post('/', createCategory)

// DELETE a category
router.delete('/:id', deleteCategory)

// UPDATE a category
router.patch('/:id', updateCategory)

module.exports = router