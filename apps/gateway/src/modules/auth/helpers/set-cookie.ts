import { Response } from 'express';
import {atExpiration, rtExpiration} from "../constants";

export const setCookies = (
    res: Response,
    rt: string,
    at: string,
) => {

    res.cookie('rt', rt, {
        expires: rtExpiration,
        httpOnly: true,
    });

    res.cookie('at', at, {
        expires: atExpiration,
        httpOnly: true,
    });
};