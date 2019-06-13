import {
  Args,
  Info,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { User } from '../graphql.schema';
import { BatchPayload } from '../prisma/prisma.binding';
// import {MtVocab } from '../prisma/prisma.binding'
import { PrismaService } from '../prisma/prisma.service';

@Resolver()
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query('users')
  async getPersons(@Args() args, @Info() info?): Promise<User[]> {
    // console.log(JSON.stringify(args));
    return await this.prisma.query.users(args, info);
  }

  @Query('user')
  async getPerson(@Args() args, @Info() info): Promise<User> {
    return await this.prisma.query.user(args, info);
  }

  @Mutation('updateUser')
  async updatePost(@Args() args, @Info() info): Promise<User> {
    return await this.prisma.mutation.updateUser(args, info);
  }
}
