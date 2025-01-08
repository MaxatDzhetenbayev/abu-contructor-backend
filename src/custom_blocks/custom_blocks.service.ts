import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCustomBlockDto } from './dto/create-custom_block.dto';
import { CustomBlock } from './entities/custom_block.entity';
import { InjectModel } from '@nestjs/sequelize';
import sequelize from 'sequelize';

@Injectable()
export class CustomBlocksService {
  logger = new Logger('CustomBlocksService');

  constructor(
    @InjectModel(CustomBlock)
    private curtomBlockRepository: typeof CustomBlock,
  ) {}

  async create(createCustomBlockDto: CreateCustomBlockDto) {
    try {
      const createdCustomBlock =
        await this.curtomBlockRepository.create(createCustomBlockDto);

      if (!createdCustomBlock)
        throw new InternalServerErrorException('Block could not be created');

      return createdCustomBlock;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Block could not be created');
    }
  }

  async findAllBlockBySlug(navigation_slug: string) {
    try {
      const createdCustomBlock = await this.curtomBlockRepository.findAll({
        attributes: [
          'title',
          [
            sequelize.fn(
              'json_agg',
              sequelize.literal("row_to_json('custom_blocks')"),
            ),
            'items',
          ],
        ],
        where: {
          navigation_slug,
        },
        // limit,
      });

      if (!createdCustomBlock)
        throw new InternalServerErrorException('Block could not be created');

      return createdCustomBlock;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Block could not be created');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} customBlock`;
  }

  update(id: number) {
    return `This action updates a #${id} customBlock`;
  }

  remove(id: number) {
    return `This action removes a #${id} customBlock`;
  }
}
