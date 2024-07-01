import { atom } from "recoil";

export interface UserInfoType {
  email: string;
  photo: string | null;
  userId: number;
  name: string;
}

export const userInfoState = atom<UserInfoType>({
  key: "userInfoState",
  default: {
    email: "",
    photo: null,
    userId: 0,
    name: ""
  }
});