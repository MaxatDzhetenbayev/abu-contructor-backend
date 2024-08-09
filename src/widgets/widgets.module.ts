import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Widget } from './widgets.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Widget]),
  ],
  controllers: [WidgetsController],
  providers: [WidgetsService],
})
export class WidgetsModule { }
