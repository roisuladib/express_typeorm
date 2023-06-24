import { Request } from 'express';

/**
 * Helper function to extract and validate request parameters.
 * @param req - The Express request object.
 * @returns An object containing the validated parameters.
 */
export function extractPageLimitParams(
   req: Request<
      {},
      {},
      {},
      {
         page: number;
         limit: number;
      }
   >
) {
   const params = {
      page: req.query.page ? parseInt(String(req.query.page), 10) : 1,
      limit: req.query.limit ? parseInt(String(req.query.limit), 10) : 10,
      skip: 0, // Default value for skip
   };

   params.skip = (params.page - 1) * params.limit;

   return params;
}
