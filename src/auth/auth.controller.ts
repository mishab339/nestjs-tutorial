import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post()
    Login(@Body() user:{email:string,password:string}){
        return this.authService.login(user.email,user.password);
    }

    @Post('signup')
    async SignUp(@Body() createUserDto:CreateUserDto ){
       return await this.authService.signup(createUserDto)
    }

}
