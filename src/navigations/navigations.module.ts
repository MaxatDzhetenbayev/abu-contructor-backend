import { Module } from '@nestjs/common';
import { NavigationsService } from './navigations.service';
import { NavigationsController } from './navigations.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navigation } from './entities/navigation.entity';

@Module({
  imports: [SequelizeModule.forFeature([Navigation])],
  controllers: [NavigationsController],
  providers: [NavigationsService],
  exports: [NavigationsService],
})
export class NavigationsModule {}
