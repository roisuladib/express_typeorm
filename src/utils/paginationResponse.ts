import { Status } from '../types';

/**
 * Paginates a response by splitting the data into pages based on the given page and limit parameters.
 * @param data - The data to paginate, consisting of an array of items and the total count.
 * @param page - The current page number.
 * @param limit - The maximum number of items per page.
 * @returns The paginated response object.
 */
export function paginateResponse<T>(
   data: [T[], number],
   page: number,
   limit: number
): {
   status: Status;
   data: T[];
   pagination: {
      count: number;
      currentPage: number;
      nextPage: number | null;
      prevPage: number | null;
      lastPage: number;
   };
} {
   const [result, total] = data;
   const lastPage = Math.ceil(total / limit);
   const nextPage = page + 1 > lastPage ? null : page + 1;
   const prevPage = page - 1 < 1 ? null : page - 1;

   return {
      status: 'success',
      data: result,
      pagination: {
         count: total,
         currentPage: page,
         nextPage: nextPage,
         prevPage: prevPage,
         lastPage: lastPage,
      },
   };
}
