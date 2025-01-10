import { PrismaClient, Image, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ImageRepository {
  async findAll(): Promise<Image[]> {
    return prisma.image.findMany();
  }

  async findById(id: number): Promise<Image | null> {
    return prisma.image.findUnique({
      where: { id }
    });
  }

  async create(data: Prisma.ImageCreateInput): Promise<Image> {
    return prisma.image.create({
      data
    });
  }

  async update(id: number, data: Prisma.FeedbackUpdateInput): Promise<Image | null> {
    return prisma.image.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.image.delete({
      where: { id }
    });
  }
}
