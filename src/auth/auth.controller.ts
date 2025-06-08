import { Controller,Post, Body, Get, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, GetRowHeaders, Auth } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }


  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User,
  ){
    return this.authService.checkAuthStatu(user)
  }


  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser(['email','id']) userEmail: string,
    @GetRowHeaders() rawHeaders: string[]
  ){
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders
    }
  }

  @Get('private2')
  @Auth(ValidRoles.admin)
  testingPrivateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
    }
  }

  
}
