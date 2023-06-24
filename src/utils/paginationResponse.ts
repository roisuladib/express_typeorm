import { Response } from 'express';

/**
 * Paginates the response with pagination headers.
 * @param res - The Express response object.
 * @param data - The paginated data and total count.
 * @param page - The current page number.
 * @param limit - The number of items per page.
 */
export function paginateResponse<T>(
   res: Response,
   data: [T[], number],
   page: number,
   limit: number
) {
   const [result, count] = data;
   const lastPage = Math.ceil(count / limit);
   const nextPage = page + 1 > lastPage ? null : page + 1;
   const prevPage = page - 1 < 1 ? null : page - 1;

   /**
    * Sets a pagination header with the specified field and value.
    * @param field - The header field name.
    * @param value - The header field value.
    * @returns The modified response object.
    */
   const resHeader = (field: string, value: number | null) => {
      return res.header(`Pagination-${field}`, String(value));
   };

   resHeader('Count', count);
   resHeader('Limit', limit);
   resHeader('Current-Page', page);
   resHeader('Prev-Page', prevPage);
   resHeader('Next-Page', nextPage);
   resHeader('Last-Page', nextPage);
   resHeader('Last-Page', lastPage);
   res.json(result);
}
