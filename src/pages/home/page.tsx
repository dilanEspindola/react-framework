"use ssr";

import { useEffect, useState } from "react";

const HomePage = () => {
  // const getPosts = async () => {
  //   const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  //   const data = await res.json();
  //   console.log(data);
  // };

  // const posts: any = getPosts();

  // getPosts();

  // useEffect(() => {
  //   console.log("hello");
  // }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint amet
        quibusdam est possimus, mollitia dolores iure alias vero quas, optio et
        libero, maiores omnis unde veniam asperiores labore aliquam dignissimos!
      </p>

      <div>posts</div>

      {/* <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul> */}

      <button>hello</button>
    </div>
  );
};

export default HomePage;
