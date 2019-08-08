import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PersonResolver } from './person.resolver';
import { CaseResolver } from './case.resolver';
import { ClientResolver } from './client.resolver';
import { ApplicationResolver } from './application.resolver';
import { UserResolver } from './users.resolver';
import { MTVocabResolver } from './mtvocab.resolver';
import { RolesTypeResolver } from './rolestype.resolver';
import { RoleResolver } from './role.resolver';
import { LogRequestResolver } from './logrequest.resolver';
import { NetworkResolver } from './network.resolver';
import { CaseProgressActivityResolver } from './caseprogressactivity.resolver';

const RESOLVER = [
  PersonResolver,
  CaseResolver,
  ClientResolver,
  ApplicationResolver,
  UserResolver,
  MTVocabResolver,
  RolesTypeResolver,
  RoleResolver,
  LogRequestResolver,
  NetworkResolver,
  CaseProgressActivityResolver,
];

@Module({
  providers: [...RESOLVER],
  exports: [...RESOLVER],
  imports: [PrismaModule],
})
export class ResolverModule {}
