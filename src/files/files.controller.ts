import {
  Controller,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import * as fs from 'fs';
@Controller('upload')
export class FilesController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(__dirname);
      console.log(file.filename);
      return file.filename;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':fileName')
  deleteFile(@Param('fileName') fileName: string) {
    try {
      const uploadDir = resolve(__dirname, '..', '..', 'uploads');
      const filePath = join(uploadDir, fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new Error(`Не удалось удалить файл: ${err.message}`);
        }
        console.log(`Файл ${fileName} успешно удален.`);
      });

      return {
        message: `File - ${fileName} deleted successfully`,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
