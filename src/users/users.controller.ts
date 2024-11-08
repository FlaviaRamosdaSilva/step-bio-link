import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: UserDto) {
    return await this.usersService.create(data);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UserDto) {
    return await this.usersService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }

  // rota para alterar a senha que veio com o token:
  @Patch('reset-password/:recoverToken')
  async resetPassword(
    @Param('recoverToken') recoverToken: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.updatePassword(
      recoverToken,
      updatePasswordDto,
    );
  }
}
