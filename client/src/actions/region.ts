import actionCreatorFactory from 'typescript-fsa';
import { Region } from '../services/summoners';

const actionCreator = actionCreatorFactory();

export const setRegion = actionCreator<Region>('SET_REGION');