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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  GetAllUsers(@Query() pageQueryDto:PaginationQueryDto) {
    return this.usersService.getAllUsers(pageQueryDto);
  }

  @UseGuards(AuthorizeGuard)
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
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
