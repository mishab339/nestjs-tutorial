import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  isAthentcated: boolean = false;

  login(email: string, pswd: string) {
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
