import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Param } from '@nestjs/common';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as moment from 'moment';
import { MTVocabResolver } from 'dist/resolver/mtvocab.resolver';
import {
  MtVocabGroupWhereInput,
  MtVocabWhereInput,
} from './prisma/prisma.binding';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mtVocabResolver: MTVocabResolver,
  ) {}

  @Get()
  async getHello(): Promise<any> {
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
  serveAvatar(@Param('fileId') fileId, @Res() res): any {
    res.sendFile(fileId, { root: 'files' });
  }

  @Get('jsonMtvocab')
  async jsonMtvocab(): Promise<any> {
    // tslint:disable-next-line: no-angle-bracket-type-assertion
    const a = <MtVocabWhereInput>{};
    a.kode_list = <MtVocabGroupWhereInput>{ kode_list: 4};
    const dataUser = await this.mtVocabResolver.getMtVocabs(
      { where: a },
      ` {KODE
      kode_induk
      level
      sembunyikan
      teks
      urutan
    }`,
    );

    let arr = [];
    let lvl0 = dataUser.filter(res => res.level === 0);
    let lvl1 = dataUser.filter(res => res.level === 1);
    let lvl2 = dataUser.filter(res => res.level === 2);
    let lvl3 = dataUser.filter(res => res.level === 3);

    for (let a of lvl0) {
      let a1 = {
        id: a.KODE,
        text: a.teks,
        iconCls: 'icon-blank',
        children: [],
      };
      for (let b of lvl1) {
        if (b.kode_induk === a.KODE) {
          let b1 = {
            id: b.KODE,
            text: b.teks,
            iconCls: 'icon-blank',
            children: [],
          };
          a1.children.push(b1);

          for (let c of lvl2) {
            if (c.kode_induk === b.KODE) {
              let c1 = {
                id: c.KODE,
                text: c.teks,
                iconCls: 'icon-blank',
                children: [],
              };
              b1.children.push(c1);

              for (let d of lvl3) {
                if (d.kode_induk === c.KODE) {
                  let d1 = { id: d.KODE, text: d.teks, iconCls: 'icon-blank' };
                  c1.children.push(d1);
                }
              }
            }
          }
        }
      }
      arr.push(a1);
    }
    return arr;
  }
}
