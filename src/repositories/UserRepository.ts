import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        number: data.number,
        role: data.role
      }
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
}
