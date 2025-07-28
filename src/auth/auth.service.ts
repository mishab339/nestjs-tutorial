import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    
    @Inject(authConfig.KEY)
    private readonly authCofiguaration: ConfigType<typeof authConfig>
  ) {}
  isAthentcated: boolean = false;

  login(email: string, pswd: string) {
    console.log(this.authCofiguaration)
    // const user = this.usersService.users.find(
    //   (u) => u.email === email && u.password === pswd,
    // );
    // if (user) {
    //   this.isAthentcated = true;
    //   return { message: 'Login successful', userId: user.id };
    // } else {
    //   return { message: 'Invalid credentials' };
    // }
  }
}
