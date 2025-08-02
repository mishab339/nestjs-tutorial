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
import { User } from 'src/users/user.entity';
import { ActiveUserType } from './interfaces/active-user-type.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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
    return this.generateToken(user);
  }

  public async signup(createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.authConfigurations.secret,
          audience: this.authConfigurations.audience,
          issuer: this.authConfigurations.issuer,
        },
      );
      const user = await this.usersService.getUserById(sub);
      return await this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfigurations.secret,
        expiresIn: expiresIn,
        audience: this.authConfigurations.audience,
        issuer: this.authConfigurations.issuer,
      },
    );
  }

  private async generateToken(user: User) {
    const accessToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfigurations.expiresIn,
      { email: user.email },
    );
    const refreshToken = await this.signToken(
      user.id,
      this.authConfigurations.refreshTokenExpiresIn,
    );

    return { token: accessToken, refreshToken };
  }
}
