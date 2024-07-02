import { atom } from "recoil";

export interface UserInfoType {
  email: string;
  photo: string | null;
  userId: number;
  name: string;
  info: string;
  followingUser: FollowingUserType[];
  myPost : PostType[];
  myTemplate: TemplateType[];
}

export interface MyInfoType {
  email: string;
  photo: string | null;
  userId: number;
  name: string;
  info: string;


}

export interface FollowingUserType {
  userId: number;
  name: string;
  photo: string | null;
}

export interface PostType {
  postId: number;
  username: string;
  userImg: string | null;
  category: string;
  title: string;
  content: string;
  thumbnailImg : string | null;
  createdAt : Date;
  comments: number;
  likes: number;
  views: number;
  liked: boolean;
  subscribed: boolean;
};

export interface TemplateType {
  templateId: number;
  username: string;
  userImg: string | null;
  category: string;
  title: string;
  content: string;
  thumbnailImg : string | null;
  createdAt : Date;
  likes: number;
  views: number;
  liked: boolean;
  subscribed: boolean;
};

export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: "All"
});

export const filterState = atom({
  key: "filterState",
  default: "All"
});

export const userInfoState = atom<UserInfoType>({
  key: "userInfoState",
  default: {
    email: "",
    photo: null,
    userId: 0,
    name: "",
    info: "",
    followingUser: [],
    myPost: [],
    myTemplate: []
  }
});

export const modeState = atom({
  key: "modeState",
  default: "default"
});

export const postEditorState = atom({
  key: "postEditorState",
  default: "",
});

export const postTitleState = atom({
  key: "postTitleState",
  default: "",
});