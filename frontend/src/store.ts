import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import {configureStore, createSlice} from '@reduxjs/toolkit'

interface AuthenticatedState {value: boolean}
const initialState: AuthenticatedState = {
  value: false,
}

export const authenticatedSlice = createSlice({
  name: 'authenticated',
  initialState,
  reducers: {
    setAuthorized: (state, action) => {
      state.value = action.payload
    },
  },
})

export const {setAuthorized} = authenticatedSlice.actions

const store = configureStore({
  reducer: {
    authenticated: authenticatedSlice.reducer,
  },
})
export default store


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

