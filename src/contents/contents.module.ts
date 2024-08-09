import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Content } from './contents.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Content]),
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule { }
