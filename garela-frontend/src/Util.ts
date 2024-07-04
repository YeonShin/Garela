import axios from "axios";
import { useRecoilState } from "recoil";
import { myInfoState, UserInfoType } from "./atom";



export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seoulOffset = 9 * 60; // Seoul is UTC+9
  const localOffset = now.getTimezoneOffset(); // Get the local time zone offset in minutes

  // Convert the input date to Seoul time
  const seoulTime = new Date(date.getTime() + (seoulOffset + localOffset) * 60000);
  const seconds = Math.floor((now.getTime() - seoulTime.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval >= 1) {
    return `${interval} year${interval !== 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return `${interval} month${interval !== 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 604800);
  if (interval >= 1) {
    return `${interval} week${interval !== 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return `${interval} day${interval !== 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return `${interval} hour${interval !== 1 ? "s" : ""} ago`;
  }
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return `${interval} minute${interval !== 1 ? "s" : ""} ago`;
  }
  return `${Math.floor(seconds)} second${seconds !== 1 ? "s" : ""} ago`;
};
