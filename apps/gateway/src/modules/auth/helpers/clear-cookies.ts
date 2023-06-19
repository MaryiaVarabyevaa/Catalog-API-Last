import { Response } from 'express';

export const clearCookies = (res: Response): void => {
  clearCookie(res, 'rt');
  clearCookie(res, 'at');
};

const clearCookie = (res: Response, key: string): void => {
  res.clearCookie(key);
};
