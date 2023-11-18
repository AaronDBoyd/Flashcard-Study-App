import { createContext, useReducer } from 'react'

export const CardContext = createContext()

export const cardsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CARDS':
            return {
                cards: action.payload
            }
        case 'CREATE_CARD':
                return {
                cards: [action.payload, ...state.cards]
                }
        case 'DELETE_CARD':
            return {
                cards: state.cards.filter((c) => c._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const CardContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cardsReducer, {
        cards: []
    })

    console.log('CardContext: ', state)
    
    return (
        <CardContext.Provider value={{...state, dispatch}}>
        { children }
    </CardContext.Provider>
)
}