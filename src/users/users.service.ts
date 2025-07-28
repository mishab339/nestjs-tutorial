import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/profile/profile.entity';
import { ConfigService } from '@nestjs/config';

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
    userDto.profile = userDto.profile ?? {};
    let user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
  }
  public async deleteUser(id: number) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  public async getUserById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
