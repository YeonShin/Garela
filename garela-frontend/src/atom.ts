import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';
import { NumberLiteralType } from "typescript";

const { persistAtom } = recoilPersist();

export interface UserInfoType {
  userId: number;
  email: string;
  profileImg: string | null;
  name: string;
  info: string;
  myTemplates: {
      likes: number;
      title: string;
      views: number;
      userImg: string | null;
      category: string;
      createdAt: Date;
      templateId: number;
      thumbnailImg: string | null;
    }[];
  myPosts: {
      likes: number;
      title: string;
      views: number;
      postId: number;
      summary: string;
      userImg: string | null;
      category: string;
      comments: number;
      userName: string;
      createdAt: Date;
      thumbnailImg: string | null;
    }[];
  followingUsers: {
    info: string;
    name: string;
    userId : number;
    profileImg: string | null;
  }[];
  templateLibrary: {
    title: string;
    category: string;
    templateId: number;
    isMyTemplate : boolean;
    thumbnailImg: string | null;
  }[];
}

export const myInfoState = atom<UserInfoType>({
  key: "myInfoState",
  default: {
    userId: 0,
    email: "",
    profileImg: null,
    name: "",
    info: "",
    myTemplates: [],
    myPosts: [],
    followingUsers: [],
    templateLibrary: []
  },
effects_UNSTABLE: [persistAtom],
});


export interface PostListType {
  postId: number;
  title: string;
  summary: string;
  thumbnailImg : string | null;
  userId : number;
  userName : number;
  userImg : string | null;
  category : string;
  createdAt : Date;
  comments : number;
  views : number;
  likes : number;
  subscribed : boolean;
};

export interface PostType {
  postId: number;
  title : string;
  content : string;
  userId : number;
  userName : string;
  userImg : string | null;
  userInfo : string;
  category : string;
  createdAt : Date;
  comments: number;
  views : number;
  likes : number;
  myPost : boolean;
  liked : boolean;
  followed : boolean;
  commentList: CommentType [];
}

export interface CommentType {
  commentId: number;
  userImg : string | null;
  userName : string;
  createdAt : Date;
  content : string;
  myComment : number;
}

export interface TemplateType {
  templateId: number;
  username: string;
  userImg: string | null;
  category: string;
  title: string;
  content: string;
  thumbnailImg: string | null;
  createdAt: Date;
  likes: number;
  views: number;
  liked: boolean;
  subscribed: boolean;
}

export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: "All",
});

export const filterState = atom({
  key: "filterState",
  default: "All",
});



export const modeState = atom({
  key: "modeState",
  default: "default",
});

export const postEditorState = atom({
  key: "postEditorState",
  default: "",
});

export const postTitleState = atom({
  key: "postTitleState",
  default: "",
});

export const postCategoryState = atom({
  key: "postCategoryState",
  default : ""
});

export const postSummaryState = atom({
  key: "postSummaryState",
  default: "",
});

export const postFileState = atom<File | null> ({
  key : "postFileState",
  default : null
});
