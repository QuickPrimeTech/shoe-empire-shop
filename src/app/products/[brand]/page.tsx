// @/app/products/[brand]/page.tsx

type PageProps = {
  params: Promise<{
    brand: string;
  }>;
};

export default async function ProductBrand({ params }: PageProps) {
  const { brand } = await params;
  return <h1 className="heading-1">You've reached the brand {brand}</h1>;
}
