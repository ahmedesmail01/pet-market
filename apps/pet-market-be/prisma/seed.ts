import { PrismaClient, Prisma } from '../src/generated/prisma';
import { productsList } from './productsList';

const prisma = new PrismaClient();

type ProductStripeOnly = Prisma.ProductGetPayload<{
  select: { stripePriceId: true };
}>;

async function main() {
  console.log('Start seeding...');

  // Check existing products
  const existingProducts: ProductStripeOnly[] = await prisma.product.findMany({
    select: { stripePriceId: true },
  });
  const existingPriceIds = new Set(
    existingProducts.map((p) => p.stripePriceId)
  );

  console.log({ existingProducts });

  console.log({ productsList });

  // Create only products that don't exist
  for (const product of productsList) {
    const { ...productData } = product;
    if (!existingPriceIds.has(productData.stripePriceId)) {
      await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          stripePriceId: productData.stripePriceId,
          isFeatured: productData.isFeatured,
          createdAt: productData.createdAt,
          updatedAt: productData.updatedAt,
        },
      });
      console.log(`Created product: ${productData.name}`);
    } else {
      console.log(`Skipping existing product: ${productData.name}`);
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
