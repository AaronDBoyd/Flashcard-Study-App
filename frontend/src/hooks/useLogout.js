import { useAuthContext } from './useAuthContext'

export const useLogout = () => {
    const { dispatch } = useAuthContext()
    // const { dispatch: categoriesDispatch } = useCategoriesDispatch()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')

        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        //categoriesDispatch({type: 'SET_CATEGORIES', payload: null})
    }

    return {logout}
}