import { Module } from '@nestjs/common';

import { NavigationsModule } from './navigations/navigations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';

import { WidgetsModule } from './widgets/widgets.module';
import { ContentsModule } from './contents/contents.module';
import { TemplateModule } from './template/template.module';
import { FilesModule } from './files/files.module';

import { Navigation } from './navigations/entities/navigation.entity';
import { Widget } from './widgets/entities/widget.entity';
import { Content } from './contents/entities/content.entity';
import { Template } from './template/entities/template.entity';

import { join } from 'path';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'abu',
      logging: false,
      models: [Navigation, Widget, Content, Template],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    NavigationsModule,
    WidgetsModule,
    ContentsModule,
    TemplateModule,
    FilesModule,
  ],
})
export class AppModule { }
