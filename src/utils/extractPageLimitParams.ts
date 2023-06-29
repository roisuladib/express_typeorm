import { PageLimit, TypedRequestQuery } from '../types';

/**
 * Helper function to extract and validate request parameters.
 * @param req - The Express request object.
 * @returns An object containing the validated parameters.
 */
export function extractPageLimitParams(req: TypedRequestQuery<PageLimit>) {
   const params = {
      page: req.query.page ? parseInt(req.query.page, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
      skip: 0, // Default value for skip
   };

   params.skip = (params.page - 1) * params.limit;

   return params;
}
