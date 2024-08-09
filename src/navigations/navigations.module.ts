import { Module } from '@nestjs/common';
import { NavigationsService } from './navigations.service';
import { NavigationsController } from './navigations.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navigation } from './navigations.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Navigation]),
  ],
  controllers: [NavigationsController],
  providers: [NavigationsService],
})
export class NavigationsModule { }
