import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'Config/prisma.service'; // Importa o PrismaService
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.email, senha: user.password };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // token de quem esqueceu a senha:

  async signUp(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  ///Aqui é minha parte:
  async sendRecoverPasswordEmail(email: string): Promise<void> {
    // Busca o usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Não há usuário cadastrado com esse email.');
    }

    // Gera um token de recuperação e atualiza o usuário no banco de dados
    const recoverToken = randomBytes(32).toString('hex');
    await this.prisma.user.update({
      where: { email },
      data: { recoverToken },
    });

    // Configuração do email
    const mail = {
      to: user.email,
      from: 'noreply@biolinkapplication.com',
      subject: 'Recuperação de senha',
      template: 'recover-password',
      context: {
        token: recoverToken, // O token é passado para o template do email
      },
    };

    // Envia o email
    await this.mailerService.sendMail(mail);
  }
}
