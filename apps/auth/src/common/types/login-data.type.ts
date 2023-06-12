import {IUser} from "../../modules/auth/types/user.type";

export type LoginData = Omit<IUser, 'firstName' | 'lastName'>