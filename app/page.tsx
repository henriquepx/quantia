import HomePage from "@/screens/HomePage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;

  return (
    <HomePage initialCategory={params.category ?? "all"} />
  );
}