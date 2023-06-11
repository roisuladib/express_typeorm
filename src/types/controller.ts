import { Request, Response } from 'express';
import { Query, Send } from "express-serve-static-core";

export type Status = 'success' | 'error' | 'fail'

interface ResBody {
   status: Status;
   code?: number;
   message?: string | null;
   [key: string]: any;
}

export interface Req<ReqQuery extends Query = Query, ReqBody extends Record<string, any> = Record<string, any>> extends Request {
   query: ReqQuery;
   body: ReqBody;
}

export interface Res extends Response {
   json: Send<ResBody, this>;
}
