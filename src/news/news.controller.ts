import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { NewsService } from './news.service';
// import { CreateNewsDto } from './dto/create-news.dto'; @Body() createNewsDto: CreateNewsDto
import { UpdateNewsDto } from './dto/update-news.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'kz', maxCount: 5 },
        { name: 'ru', maxCount: 5 },
        { name: 'en', maxCount: 5 },
      ],
      {
        storage: diskStorage({
          destination: join(__dirname, '..', '..', 'uploads'),
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          callback(null, true);
        },
      },
    ),
  )
  create(@UploadedFiles() files, @Body() createNewsDto: any) {
    console.log('files: ' + files, 'createNewsDto: ' + createNewsDto);
    return files;

    // return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.newsService.findAll(limit, offset);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('direction') direction: 'prev' | 'next',
  ) {
    return this.newsService.findOne(+id, direction);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
