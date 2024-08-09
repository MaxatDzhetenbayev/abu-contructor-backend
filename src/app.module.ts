import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NavigationsModule } from './navigations/navigations.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navigation } from './navigations/navigations.model';
import { WidgetsModule } from './widgets/widgets.module';
import { Widget } from './widgets/widgets.model';
import { ContentsModule } from './contents/contents.module';
import { Content } from './contents/contents.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'admin',
      database: 'abu',
      models: [Navigation, Widget, Content],
    }),
    NavigationsModule,
    WidgetsModule,
    ContentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
