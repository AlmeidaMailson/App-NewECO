// models/Post.ts
export default class Post {

      id: string;
  user: string;
  image: string;
  caption: string;
  likes: number;
  constructor(id: string, user: string, image: string, caption: string, likes: number = 0) {
    this.id = id;
    this.user = user;
    this.image = image;
    this.caption = caption;
    this.likes = likes;
  }

  like() {
    this.likes += 1;
  }

  unlike() {
    this.likes = Math.max(0, this.likes - 1);
  }
}
