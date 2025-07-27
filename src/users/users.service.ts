import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    private readonly configService: ConfigService
  ) {}

  getAllUsers() {
    const environment = this.configService.get<string>('ENV_MODE');
    console.log(`Current Environment: ${environment}`);
    return this.userRepository.find({
      relations: {
        profile: true,
      },
    });
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
