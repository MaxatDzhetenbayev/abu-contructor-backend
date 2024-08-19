import { Module } from '@nestjs/common';

import { NavigationsModule } from './navigations/navigations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navigation } from './navigations/entities/navigation.entity';
import { WidgetsModule } from './widgets/widgets.module';
import { Widget } from './widgets/entities/widget.entity';
import { ContentsModule } from './contents/contents.module';
import { Content } from './contents/entities/content.entity';
import { TemplateModule } from './template/template.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

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
      models: [Navigation, Widget, Content],
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
export class AppModule {}
