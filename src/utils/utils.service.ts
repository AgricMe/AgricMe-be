import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from 'src/user/schema/user.schema';
import { ResolvePaginationQuery } from './interface';

@Injectable()
export class UtilService {
  constructor() {}

  async hashPassword(password: string): Promise<string> {
    const saltFactor = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltFactor);

    return hashedPassword;
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  excludePassword(user: UserDocument) {
    delete user['_doc'].password;

    return user['_doc'];
  }

  resolvePaginationQuery(query: ResolvePaginationQuery) {
    const page = Number(query.page) || 1;
    let limit = query?.limit ?? 100000000000;
    const skip = (page - 1) * limit;
    console.log(query.count, limit);
    const totalPages = Math.ceil(query.count / limit);

    if (query?.limit === 0) limit = query.count;

    if (query?.limit === 0 && query.count === 0) limit++;

    return {
      skip,
      page,
      limit,
      totalPages,
      count: query.count,
    };
  }
}
