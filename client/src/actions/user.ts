import actionCreatorFactory from 'typescript-fsa';
import { asyncActionWrapper } from "../common/helpers";
import { Failure } from "../services/remoteService";
import { EditUserCredsDTO, EditUserDTO, LogInDTO, RegisterUserDTO, RegisterUserResponse, User, UserService } from '../services/user';

const actionCreator = actionCreatorFactory();
const userService = new UserService();

export const registerUserAsync = asyncActionWrapper(actionCreator).async<RegisterUserDTO, RegisterUserResponse | Failure>
  ('REGISTER_USER');
export const registerUser = (dto: RegisterUserDTO) =>
  registerUserAsync.run(dto, async () => {
    const result = await userService.registerUser(dto);
    if ((result as Failure).status_code) throw result;
    return result;
});

export const fetchSessionAsync = asyncActionWrapper(actionCreator).async<{}, User | Failure>
  ('FETCH_SESSION');
export const fetchSession = () =>
  fetchSessionAsync.run({}, async () => {
    const result = await userService.fetchSession();
    if ((result as Failure).status_code) throw result;
    return result;
});

export const logOutAsync = asyncActionWrapper(actionCreator).async<{}, string | Failure>
  ('LOG_OUT');
export const logOut = () =>
  logOutAsync.run({}, async () => {
    const result = await userService.logOut();
    if ((result as Failure).status_code) throw result;
    return result;
});

export const logInAsync = asyncActionWrapper(actionCreator).async<LogInDTO, RegisterUserResponse | Failure>
  ('LOG_IN');
export const logIn = (dto: LogInDTO) =>
  logInAsync.run(dto, async () => {
    const result = await userService.logIn(dto);
    if ((result as Failure).status_code) throw result;
    return result;
});

export const editUserAsync = asyncActionWrapper(actionCreator).async<EditUserDTO, User | Failure>
  ('EDIT_USER');
export const editUser = (dto: EditUserDTO) =>
  editUserAsync.run(dto, async () => {
    const result = await userService.editUser(dto);
    if ((result as Failure).status_code) throw result;
    return result;
});

export const editUserCredsAsync = asyncActionWrapper(actionCreator).async<EditUserCredsDTO, User | Failure>
  ('EDIT_USER_CREDS');
export const editUserCreds = (dto: EditUserCredsDTO) =>
  editUserCredsAsync.run(dto, async () => {
    const result = await userService.editUserCreds(dto);
    if ((result as Failure).status_code) throw result;
    return result;
});

export const removeUserAsync = asyncActionWrapper(actionCreator).async<{}, User | Failure>
  ('REMOVE_USER');
export const removeUser = () =>
  removeUserAsync.run({}, async () => {
    const result = await userService.removeUser();
    if ((result as Failure).status_code) throw result;
    return result;
});
