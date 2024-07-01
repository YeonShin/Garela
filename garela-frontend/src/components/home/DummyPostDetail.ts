export interface CommentType {
  userId: number;
  userName: string;
  userImg: string | null;
  createdAt: Date;
  content: string;
  myComment: boolean;
}

export interface PostDetailType {
  postId: number;
  userId: number;
  userImg: string | null;
  userName: string;
  userInfo: string;
  category: string;
  createdAt: Date;
  title: string;
  postImg: string | null;
  content: string;
  comments: number;
  likes: number;
  views: number;
  liked: boolean;
  myPost: boolean;
  comment: CommentType[];
}

const DummyPostDetail: PostDetailType = {
  postId: 1,
  userId: 1,
  userImg: "https://via.placeholder.com/40",
  userName: "user1",
  userInfo: "User Information",
  category: "Study",
  createdAt: new Date("2023-07-01T12:00:00Z"),
  title: "First Post Title",
  postImg: "https://via.placeholder.com/150",
  content: `# Sample Post
  This is a **sample** post content with markdown.
  - List item 1
  - List item 2

  > This is a quote.

  [Link](http://localhost:8080)
  `,
  comments: 2,
  likes: 4,
  views: 32,
  liked: true,
  myPost: true,
  comment: [
    {
      userId: 2,
      userName: "commenter1",
      userImg: "https://via.placeholder.com/40",
      createdAt: new Date("2023-07-01T14:00:00Z"),
      content: "This is a comment",
      myComment: false,
    },
    {
      userId: 3,
      userName: "commenter2",
      userImg: "https://via.placeholder.com/40",
      createdAt: new Date("2023-07-01T15:00:00Z"),
      content: "This is another comment",
      myComment: false,
    },
  ],
};

export default DummyPostDetail;
