import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { ConfigService } from '@nestjs/config';
import { table } from 'console';
import { UserAlreadyExistsException } from 'src/CustomExceptions/user-already-exist.exception';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { HashingProvider } from 'src/auth/provider/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly paginationProvider: PaginationProvider,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async getAllUsers(paginationQueryDto: PaginationQueryDto) {
    try {
      return await this.paginationProvider.paginateQuery(
        paginationQueryDto,
        this.userRepository,
        undefined,
        ['profile'],
      );
      // return await this.userRepository.find({
      //   relations: {
      //     profile: true,
      //   },
      // });
    } catch (error) {
      throw new RequestTimeoutException(
        'An error has occurred. please try again later',
        { description: 'Could not connect To database' },
      );
    }
  }

  public async createUser(userDto: CreateUserDto) {
    try {
      userDto.profile = userDto.profile ?? {};
      const existingUserWithUsername = await this.userRepository.findOne({
        where: [{ username: userDto.username }],
      });
      if (existingUserWithUsername) {
        throw new UserAlreadyExistsException('username', userDto.username);
      }
      const existingUserWithEmail = await this.userRepository.findOne({
        where: [{ email: userDto.email }],
      });
      if (existingUserWithEmail) {
        throw new UserAlreadyExistsException('Email', userDto.email);
      }
      let user = this.userRepository.create({
        ...userDto,
        password: await this.hashingProvider.hashPassword(userDto.password),
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'An error has occurred. please try again later',
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
            'The exception occurred because a user with ID ' +
            id +
            'was not found in user table',
        },
      );
    }
    return user;
  }

  public async findUserByUsername(username: string) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ username });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'User with given username could not be found!',
      });
    }
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return user;
  }
}
