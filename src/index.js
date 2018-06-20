// @flow

import ApiClient from "./ApiClient";

let sum = (a: number, b: number): number => a + b;

console.log(sum(1, 2));

type Post = {
  id: number,
  title: string,
  author: string
};

type Response = {
  status: string,
  data: Post
};

const client = new ApiClient("faketoken");

client.fetch("GET", "/posts/1").then((response: Response) => {
  const post: Post = response.data;
  console.log(post);
});
