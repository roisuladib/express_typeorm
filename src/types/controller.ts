import { Request, Response } from 'express';
import { Query, Send } from "express-serve-static-core";

export type Status = 'success' | 'error' | 'fail'

interface ResBody {
   status?: Status;
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

// Add
export interface TypedRequestBody<T> extends Request {
   body: T
}

export interface TypedRequestQuery<T extends Query> extends Request {
   query: T
}

export interface TypedRequest<T extends Query, U> extends Request {
   body: U,
   query: T
}


export interface TypedResponse<ResBody> extends Response {
   json: Send<ResBody, this>;
}
