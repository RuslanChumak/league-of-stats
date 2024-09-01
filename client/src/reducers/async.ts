import { Action, combineReducers } from "redux";
import { Dictionary } from "../types";

const getActionType = fullType => {
  let slices = fullType.split('_');
  slices = slices.slice(0, slices.length - 1);
  return slices.join('_');
}

export function byActionReducer(state: Dictionary<AsyncAction> = {}, action: Action) {
  if (action.type.endsWith('_STARTED')) {
    return {
      ...state,
      [getActionType(action.type)]: {
        isLoading: true
      }
    }
  }

  if (action.type.endsWith('_FAILED') || action.type.endsWith('_DONE')) {
    return {
      ...state,
      [getActionType(action.type)]: {
        isLoading: false
      }
    }
  }

  return state;
}

interface AsyncAction {
  isLoading: boolean;
}

export interface AsyncState {
  byAction: Dictionary<AsyncAction>;
}
  
export const asyncReducer = combineReducers<AsyncState>({
    byAction: byActionReducer,
});
