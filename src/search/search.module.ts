import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Navigation } from 'src/navigations/entities/navigation.entity';
import { Widget } from 'src/widgets/entities/widget.entity';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [SequelizeModule.forFeature([Navigation, Widget])],
})
export class SearchModule {}
