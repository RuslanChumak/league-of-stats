import config from "../config";
import { Failure, RemoteService } from "./remoteService";
import { Region } from "./summoners";

export interface RegisterUserDTO {
  summonerName: string;	
  region: Region;
  email: string;
  password: string;
};

export interface LogInDTO {
  email: string;
  password: string;
};

export interface User extends RegisterUserDTO {
  _id: string;
}

export interface RegisterUserResponse {
  user: User;	
  token: string;
};

export interface EditUserDTO {
  summonerName: string;	
  region: Region;
};

export interface EditUserCredsDTO {
  password: string;
  email: string;
  newEmail?: string;
  newPassword?: string;
};

export class UserService extends RemoteService {
  baseUri = config.apiBase;

  async registerUser(dto: RegisterUserDTO): Promise<RegisterUserResponse | Failure> {
    return await this.callService<RegisterUserResponse, Failure>('POST', `/users`, dto);
  }

  async fetchSession(): Promise<User | Failure> {
    return await this.callService<User, Failure>('GET', `/users/me`);
  }

  async logOut(): Promise<string | Failure> {
    return await this.callService<string, Failure>('POST', `/users/logoutAll`);
  }

  async logIn(dto: LogInDTO): Promise<RegisterUserResponse | Failure> {
    return await this.callService<RegisterUserResponse, Failure>('POST', `/users/login`, dto);
  }

  async editUser(dto: EditUserDTO): Promise<User | Failure> {
    return await this.callService<User, Failure>('PUT', `/users/me`, dto);
  }

  async editUserCreds(dto: EditUserCredsDTO): Promise<User | Failure> {
    return await this.callService<User, Failure>('PUT', `/users`, dto);
  }

  async removeUser(): Promise<User | Failure> {
    return await this.callService<User, Failure>('DELETE', `/users/me`);
  }
}