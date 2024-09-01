import { debounce } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSummonerByName } from '../actions/summoners';
import { fetchSession } from '../actions/user';
import { AppState } from '../reducers';

export const Wrapper = ({ children }) => {
  const auth = useSelector((state: AppState) => state.user.authetication);
  const dispatch = useDispatch();
  const handleFetchSession = debounce(() => dispatch(fetchSession()), 500);
  
  useEffect(() => {
    handleFetchSession();
  }, []);

  useEffect(() => {
    auth && dispatch(getSummonerByName(auth.summonerName, auth.region));
  }, [auth])

  return children;
}
