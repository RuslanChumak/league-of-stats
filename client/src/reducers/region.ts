import { isType } from "typescript-fsa";
import { Region } from "../services/summoners";
import config from '../config';
import { setRegion } from "../actions/region";

export function regionReducer(state: Region = config.regions[0].value, action: any) {
    if (isType(action, setRegion)) {
      return state = action.payload;
    }

    return state;
}