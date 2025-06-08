import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {

      const { password, ...userDate } = createUserDto

      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)
      delete user.password

      return user;
      //TODO: Retornar el JWT de acceso
      
    } catch (error) {
      this.handleDBErrors(error)
    }

  }

  async loginUser ( loginUserDto: LoginUserDto){

    const { email, password } = loginUserDto

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email:true, password: true }
    })

    if (!user){
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password as string )) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return user
    //TODO: Retornar el JWT de acceso
  }


  private handleDBErrors(error: any): never{

    if (error.code === '23505')
      throw new BadRequestException ( error.detail )
    
    console.log(error)

    throw new InternalServerErrorException('Please check server logs')
  }

  
}
