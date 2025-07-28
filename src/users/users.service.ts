import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { ConfigService } from '@nestjs/config';
import { table } from 'console';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private readonly configService: ConfigService,
  ) {}

  public async getAllUsers() {
    try {
      return await this.userRepository.find({
        relations: {
          profile: true,
        },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'An error has occured. please try again later',
        { description: 'Could not connect To database' },
      );
    }
  }
  public async createUser(userDto: CreateUserDto) {
    try {
      userDto.profile = userDto.profile ?? {};
      const existingUser = await this.userRepository.findOne({
        where: [{ username: userDto.username }, { email: userDto.email }],
      });
      if (existingUser) {
        throw new BadRequestException(
          'User with this email or username already exist',
        );
      }
      let user = this.userRepository.create(userDto);
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'An error has occured. please try again later',
          { description: 'Could not connect To database' },
        );
      }
      // if (error.code === '23505') {
      //   throw new BadRequestException(
      //     'User with this email or username already exist',
      //   );
      // }
      throw error;
    }
  }
  public async deleteUser(id: number) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  public async getUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `User with id ${id} not found`,
          table: 'user',
        },
        HttpStatus.NOT_FOUND,
        {
          description:
            'The excepton occured because a user with ID ' +
            id +
            'was not found in user table',
        },
      );
    }
    return user;
  }
}
