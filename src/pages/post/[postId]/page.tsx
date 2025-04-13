"use ssr";

export async function fetchData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}

function PostPageId() {
  return <div>Post Page id edit</div>;
}

export default PostPageId;
