import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(authConfig.KEY)
    private readonly authConfigurations: ConfigType<typeof authConfig>,
  ) {}
  isAuthenticated: boolean = false;

  login(loginDto:LoginDto) {
    const user = this.usersService.findUserByUsername(loginDto.username)


    return user;
  }

  public async signup(createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
}
