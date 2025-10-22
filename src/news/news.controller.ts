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
import { CreateNewsDto } from './dto/create-news.dto';

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
  async create(
    @UploadedFiles()
    files: {
      kz?: Express.Multer.File[];
      ru?: Express.Multer.File[];
      en?: Express.Multer.File[];
    },
    @Body('data') createNewsDto: any,
  ) {
    try {
      if (!createNewsDto) {
        throw new BadRequestException('Data field is required');
      }

      const parsedDTO: CreateNewsDto = JSON.parse(createNewsDto);

      // Валидация обязательных полей
      if (!parsedDTO.title || !parsedDTO.content) {
        throw new BadRequestException('Title and content are required');
      }

      // Проверяем наличие title для всех языков
      const requiredLanguages = ['ru', 'kz', 'en'];
      for (const lang of requiredLanguages) {
        if (!parsedDTO.title[lang]) {
          throw new BadRequestException(
            `Title for language '${lang}' is required`,
          );
        }
        if (!parsedDTO.content[lang]) {
          throw new BadRequestException(
            `Content for language '${lang}' is required`,
          );
        }
      }

      console.log('Parsed DTO:', parsedDTO);
      console.log('Files:', files);

      return await this.newsService.create(parsedDTO, files);
    } catch (error) {
      console.error('Error creating news:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid data format or server error');
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
    FileFieldsInterceptor([{ name: 'kz' }, { name: 'ru' }, { name: 'en' }], {
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
      en?: Express.Multer.File[];
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
