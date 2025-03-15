import { ShortUser } from "../user/user.model";

export interface CommentModel {
  id: number;
  user: ShortUser;
  parentId: number;
  commentText: string;
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
}

export interface CreateCommentPayload {
  parentId?: number;
  commentText: string;
}

export interface GetCommentPayload {
  parentId?: number;
}