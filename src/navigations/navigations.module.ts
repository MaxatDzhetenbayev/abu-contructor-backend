import { forwardRef, Module } from '@nestjs/common';
import { NavigationsService } from './navigations.service';
import { NavigationsController } from './navigations.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navigation } from './entities/navigation.entity';
import { AppModule } from 'src/app.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Navigation]),
    forwardRef(() => AppModule),
  ],
  controllers: [NavigationsController],
  providers: [NavigationsService],
  exports: [NavigationsService],
})
export class NavigationsModule {}
