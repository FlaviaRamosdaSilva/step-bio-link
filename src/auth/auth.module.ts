import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'Config/prisma.service'; // Importa o PrismaService
import { jwtConstants } from '../auth/constants';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '18000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService], // Adiciona PrismaService aos providers
  exports: [AuthService],
})
export class AuthModule {}
