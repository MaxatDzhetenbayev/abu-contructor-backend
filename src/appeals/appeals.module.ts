import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Appeal } from './entities/appeal.entity';
import { AppealsController } from './appeals.controller';
import { AppealsService } from './appeals.service';

@Module({
  imports: [SequelizeModule.forFeature([Appeal])],
  controllers: [AppealsController],
  providers: [AppealsService],
})
export class AppealsModule {}

