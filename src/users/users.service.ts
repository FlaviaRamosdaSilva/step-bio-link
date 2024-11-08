import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'Config/prisma.service';
import { UserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(data: UserDto) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      throw new Error('User already exists');
    }

    const users = await this.prisma.user.create({
      data,
    });

    return users;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, data: UserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userExists) {
      throw new Error('User not found');
    }
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!userExists) {
      throw new Error('User not found');
    }
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  // SALVARA A NOVA SENNHA
  async updatePassword(
    recoverToken: string,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    // Encontre o usuário pelo recoverToken
    const user = await this.prisma.user.findFirst({
      where: { recoverToken },
    });

    if (!user) {
      throw new NotFoundException('Token de recuperação inválido.');
    }

    // Hash da nova senha com BCRYPT
    // const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);

    // Atualize o usuário com a nova senha e remova o recoverToken
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: updatePasswordDto.newPassword,
        recoverToken: null, // Limpa o token de recuperação após o uso
      },
    });
  }
}
