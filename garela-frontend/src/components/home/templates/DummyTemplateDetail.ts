interface TemplateDetailType {
  templateId: number;
  userId: number
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
  added: boolean;
  myTemplate: boolean;
};

const DummyTemplateDetail: TemplateDetailType = {
  templateId: 1,
  userId: 1,
  userImg: "https://via.placeholder.com/40",
  username: "user1",
  category: "Study",
  createdAt: new Date("2023-07-01T12:00:00Z"),
  title: "test",
  thumbnailImg: "https://via.placeholder.com/150",
  content: `<h1 class="ql-align-center">제목</h1><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><ol><li><s>123213213213</s></li><li><s>123213123</s></li><li><s>123</s></li></ol><p class="ql-align-center"><br></p><p class="ql-align-center"><span style="background-color: rgb(255, 153, 0);">ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ</span></p><p><br></p><p><a href="http://naver.com" rel="noopener noreferrer" target="_blank">ㅀ롷롷</a></p><p class="ql-align-center"><br></p><p class="ql-indent-1">sdfsdfsdfsdf</p><p class="ql-align-center"><br></p><blockquote>우리는 진화한다</blockquote><blockquote>고로 인간이다.</blockquote><hr style="width: 70%;"><p class="ql-align-center"><br></p><p class="ql-align-center"><strong class="ql-font-monospace"><em>We got First One. So You're the winner!</em></strong></p><p class="ql-align-center"><br></p><hr style="width: 70%;"><p class="ql-align-center">앙녕하세요 저는 김연신입니다</p><p class="ql-align-center">제가 이번에 게시판 사이트를 개ㅔ발하게 되었는데 어떠신가요?</p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><pre class="ql-syntax" spellcheck="false">ㅇㄴㄹㄴㅇㄹㄴㅇㄹ
ㅁㅁㅇㄴㅁㅇㅇ
</pre><p class="ql-align-center"><br></p>
`,
  likes: 4,
  views: 32,
  liked: true,
  myTemplate: true,
  added: true,

};

export default DummyTemplateDetail;