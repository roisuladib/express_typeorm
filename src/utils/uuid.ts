/**
 * Generates a unique identifier (UUID) using a combination of timestamp and random characters.
 * @returns {string} The generated UUID.
 */
export function uuid(): string {
   const head = Date.now().toString(32);
   const tail = Math.random().toString(32).substring(2);

   return head + tail;
}
