import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    
    @Inject(authConfig.KEY)
    private readonly authConfigurations: ConfigType<typeof authConfig>
  ) {}
  isAuthenticated: boolean = false;

  login(email: string, password: string) {
    console.log(this.authConfigurations)
    // const user = this.usersService.users.find(
    //   (u) => u.email === email && u.password === password,
    // );
    // if (user) {
    //   this.isAuthenticated = true;
    //   return { message: 'Login successful', userId: user.id };
    // } else {
    //   return { message: 'Invalid credentials' };
    // }
  }

  public async signup(createUserDto:CreateUserDto){
   return await this.usersService.createUser(createUserDto);
  }
}
