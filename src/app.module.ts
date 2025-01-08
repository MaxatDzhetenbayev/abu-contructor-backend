import { Module } from '@nestjs/common';

import { NavigationsModule } from './navigations/navigations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ServeStaticModule } from '@nestjs/serve-static';

import { WidgetsModule } from './widgets/widgets.module';
import { ContentsModule } from './contents/contents.module';
import { TemplateModule } from './template/template.module';
import { SearchModule } from './search/search.module';
import { FilesModule } from './files/files.module';

import { Navigation } from './navigations/entities/navigation.entity';
import { Widget } from './widgets/entities/widget.entity';
import { Content } from './contents/entities/content.entity';
import { Template } from './template/entities/template.entity';
import { Auth } from './auth/entities/auth.entity';
import { CustomBlock } from './custom_blocks/entities/custom_block.entity';

import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { NewsModule } from './news/news.module';
import { CustomBlocksModule } from './custom_blocks/custom_blocks.module';
import { News } from './news/entities/news.entity';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB,
      logging: false,
      models: [Navigation, Widget, Content, Template, Auth, CustomBlock, News],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    NavigationsModule,
    WidgetsModule,
    ContentsModule,
    SearchModule,
    TemplateModule,
    FilesModule,
    AuthModule,
    NewsModule,
    CustomBlocksModule,
    EventsModule,
  ],
  exports: [SequelizeModule],
})
export class AppModule {}
