import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(Auth)
    private authRepository: typeof Auth,
  ) { }

  createUser(createAuthDto: CreateAuthDto) {

    try {
      const createdAuth = this.authRepository.create(createAuthDto);

      if (!createdAuth)
        throw new Error('Auth could not be created');

      return createdAuth;
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
