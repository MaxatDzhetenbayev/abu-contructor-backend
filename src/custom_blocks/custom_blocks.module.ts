import { Module } from '@nestjs/common';
import { CustomBlocksService } from './custom_blocks.service';
import { CustomBlocksController } from './custom_blocks.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { CustomBlock } from './entities/custom_block.entity';

@Module({
  imports: [SequelizeModule.forFeature([CustomBlock])],
  controllers: [CustomBlocksController],
  providers: [CustomBlocksService],
})
export class CustomBlocksModule {}
