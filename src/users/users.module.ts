import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/profile/profile.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/auth/config/auth.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthorizeGuard } from 'src/auth/guards/authorize.guard';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService
  ],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    PaginationModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
