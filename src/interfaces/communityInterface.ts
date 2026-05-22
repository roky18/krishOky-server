export interface IPost {
  _id?: string;
  user: string;
  title: string;
  desc: string;
  type: string;
  img?: string;
  createdAt?: Date;
}
