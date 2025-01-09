import { PrismaClient, Immobile, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ImmobileRepository {
  async findAll(): Promise<Immobile[]> {
    return prisma.immobile.findMany({
      include: {
        proprietary: true,
        feedbacks: true,
        images: true
      }
    });
  }

  async findById(id: number): Promise<Immobile | null> {
    return prisma.immobile.findUnique({
      where: { id },
      include: {
        proprietary: true,
        feedbacks: true,
        images: true
      }
    });
  }

  async create(data: Prisma.ImmobileCreateInput): Promise<Immobile> {
    return prisma.immobile.create({
      data: {
        ...data,
        proprietary: {
          connect: { id: data.proprietary.connect?.id }
        }
      }
    });
  }

  async update(id: number, data: Prisma.ImmobileUpdateInput): Promise<Immobile | null> {
    return prisma.immobile.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.immobile.delete({
      where: { id }
    });
  }
}
