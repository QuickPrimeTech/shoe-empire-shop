// @/app/categories/[slug]/page.tsx

type CategoryParams = {
  slug: string;
};
export default async function Category({
  params,
}: {
  params: Promise<CategoryParams>;
}) {
  const { slug } = await params;
  return <h1 className="text-heading-1">Welcome to the category: {slug}</h1>;
}
