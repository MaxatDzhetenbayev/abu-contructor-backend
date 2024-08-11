import { Module } from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Widget } from './entities/widget.entity';
import { NavigationsModule } from 'src/navigations/navigations.module';

@Module({
  imports: [SequelizeModule.forFeature([Widget]), NavigationsModule],
  controllers: [WidgetsController],
  providers: [WidgetsService],
})
export class WidgetsModule {}
