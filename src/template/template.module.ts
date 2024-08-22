import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Template } from './entities/template.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Template]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule { }
