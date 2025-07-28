import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  GetAllUsers() {
    return this.usersService.getAllUsers();
  }
  @Post()
  CreateUser(@Body() user: CreateUserDto) {
    return this.usersService.createUser(user);
  }

  @Delete(':id')
  public DeleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
