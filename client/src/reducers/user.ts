import { Action, combineReducers } from "redux";
import { isType } from "typescript-fsa";
import { editUserAsync, editUserCredsAsync, fetchSessionAsync, logInAsync, logOutAsync, registerUserAsync, removeUserAsync } from "../actions/user";
import { User } from "../services/user";

export function autheticationReducer(state: User | null = null, action: Action) {
  if (
    isType(action, registerUserAsync.done) ||
    isType(action, logInAsync.done)
  ) {
    const { user, token } = action.payload.result;

    localStorage.setItem('token', token);
    return user;
  }

  if (
    isType(action, fetchSessionAsync.done) ||
    isType(action, editUserAsync.done) ||
    isType(action, editUserCredsAsync.done)
  ) {
    return action.payload.result;
  }

  if (
    isType(action, logOutAsync.done) ||
    isType(action, removeUserAsync.done)
  ) {
    localStorage.removeItem('token');
    return null;
  }

  return state;
}

export interface UserState {
  authetication: User | null;
}
  
export const userReducer = combineReducers<UserState>({
  authetication: autheticationReducer,
});
