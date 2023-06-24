import { ValidateUserData } from './validate-user-data.type';
import { ChangeUserRoleData } from './change-user-role-data.type';

export type UserData = {
  data: ValidateUserData | ChangeUserRoleData;
};
