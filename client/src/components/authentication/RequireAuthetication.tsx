import { Spin } from "antd";
import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import { fetchSessionAsync } from "../../actions/user";
import { routes } from "../../AppRoutes";
import { getLoadingState } from "../../common/helpers";
import { AppState } from "../../reducers";
import React from 'react';

export const RequireAuthetication = ({ children }) => {
  const auth = useSelector((state: AppState) => state.user.authetication);
  const isLoading = useSelector(getLoadingState(fetchSessionAsync));

  if (isLoading) return <Spin spinning />
  if (!auth) return <Redirect to={routes.root()} />

  return children;
}
