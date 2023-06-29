import { TypeOf, object, string } from 'zod';

export const createPostSchema = object({
   body: object({
      title: string({
         required_error: 'Title is required',
      }),
      content: string({
         required_error: 'Content is required',
      }),
      image: string({
         required_error: 'Image is required',
      }),
   }),
});

const params = {
   params: object({
      postId: string(),
   }),
};

export const getPostSchema = object({
   ...params,
});

export const updatePostSchema = object({
   ...params,
   body: object({
      title: string(),
      content: string(),
      image: string(),
   }).partial(),
});

export const deletePostSchema = object({
   ...params,
});

export type CreatePost = TypeOf<typeof createPostSchema>['body'];
export type GetPost = TypeOf<typeof getPostSchema>['params'];
export type UpdatePost = TypeOf<typeof updatePostSchema>;
export type DeletePost = TypeOf<typeof deletePostSchema>['params'];
