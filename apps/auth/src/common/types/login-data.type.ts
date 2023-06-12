import {IUser} from "./user.type";

export type LoginData = Omit<IUser, 'firstName' | 'lastName'>