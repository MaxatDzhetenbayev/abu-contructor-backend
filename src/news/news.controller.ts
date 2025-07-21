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
  BadRequestException,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { FindQueriesDto } from './dto/find-queries.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'kz' }, { name: 'ru' }, { name: 'en' }], {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname) || '.jpg';
          const fieldName = file.fieldname;
          callback(null, `${fieldName}_${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  create(
    @UploadedFiles()
    files: {
      kz: Express.Multer.File[];
      ru: Express.Multer.File[];
      en: Express.Multer.File[];
    },
    @Body('data') createNewsDto: any,
  ) {
    try {
      const parsedDTO = JSON.parse(createNewsDto);
      return this.newsService.create(parsedDTO, files);
    } catch (error) {
      return error;
    }
  }

  @Get()
  findAll(@Query() query: FindQueriesDto) {
    return this.newsService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('direction') direction: 'prev' | 'next',
  ) {
    return this.newsService.findOne(+id, direction);
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'kz' }, { name: 'ru' }], {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname) || '.jpg';
          callback(null, `${file.fieldname}_${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      kz?: Express.Multer.File[];
      ru?: Express.Multer.File[];
    },
    @Body('data') updateNewsRaw: string,
    @Body('imagesToKeep') imagesToKeepRaw: string,
  ) {
    try {
      const dto = JSON.parse(updateNewsRaw);
      const imagesToKeep = JSON.parse(imagesToKeepRaw);
      return this.newsService.update(+id, dto, files, imagesToKeep);
    } catch (error) {
      throw new BadRequestException('Invalid JSON format in request body');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
