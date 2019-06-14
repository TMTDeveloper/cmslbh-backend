import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Param } from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as moment from 'moment';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(3)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const removeSpace = file.originalname
            .replace(/ /g, '_')
            .replace(extname(file.originalname), '');
          const currentDate = moment().format('YYYYMMDD');
          return cb(
            null,
            `${currentDate}_${removeSpace}_${randomName}${extname(
              file.originalname,
            )}`,
          );
        },
      }),
    }),
  )
  uploadAvatar(@UploadedFile() file) {
    return file;
  }

  @Get('files/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'files' });
  }
}
