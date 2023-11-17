import { CategoryContext } from "../context/CategoryContext";
import { useContext } from 'react'

export const useCategoryContext = () => {
    const context = useContext(CategoryContext)
    
    if (!context) {
        throw Error('useCategoryContext must be used inside a CategoryContextProvider')
    }

    return context
}