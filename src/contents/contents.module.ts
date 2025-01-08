import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Content } from './entities/content.entity';
import { WidgetsModule } from 'src/widgets/widgets.module';

@Module({
  imports: [SequelizeModule.forFeature([Content]), WidgetsModule],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
