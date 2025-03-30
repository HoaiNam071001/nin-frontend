import { NFile } from "../file.model";
import { Course } from "./course.model";

export interface Section {
  id: number;
  name: string;
  description: string;
  estimatedTime: number;
  type: SectionType;
  childrens?: Section[];
  parent?: Section;
}

export interface SectionCourse extends Section {
  course?: Course;
}

export enum SectionType {
  Video = "video",
  Post = "post",
}

export interface CreateSectionPayload {
  name?: string;
  description?: string;
  estimatedTime?: number;
  type?: string;
  parentId?: number;
  courseId?: number;
}

export interface UpdateSectionPayload {
  name?: string;
  description?: string;
  estimatedTime?: number;
  type?: SectionType;
}

export interface Post {
  id: number;
  content?: string;
  estimatedTime?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostPayload {
  content?: string;
  estimatedTime?: number;
}

export interface Video {
  id: number;
  file: NFile;
  duration?: number;
}

export interface SectionContent extends Section {
  video?: Video;
  post?: Post;
  files?: NFile[];
}
