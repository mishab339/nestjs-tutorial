import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import authConfig from './config/auth.config';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(authConfig.KEY)
    private readonly authConfigurations: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}
  
  isAuthenticated: boolean = false;

  public async login(loginDto: LoginDto) {
    const user = await this.usersService.findUserByUsername(loginDto.username);

    let IsEqual: boolean = false;
    IsEqual = await this.hashingProvider.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!IsEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }
    console.log('Signing with secret:', this.authConfigurations.secret); // Or however you access it
    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.authConfigurations.secret,
        expiresIn: this.authConfigurations.expiresIn,
        audience: this.authConfigurations.audience,
        issuer: this.authConfigurations.issuer,
      },
    );
    return {
       token:token
    };
  }

  public async signup(createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
}
