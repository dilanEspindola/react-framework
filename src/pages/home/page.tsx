"use ssr";

export async function fetchData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  return data;
}

const HomePage = () => {
  return <div>{JSON.stringify(fetchData())}</div>;
};

export default HomePage;
