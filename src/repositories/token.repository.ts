import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.module";

class TokenRepository {
  public async create(dto: IToken): Promise<IToken> {
    return await Token.create(dto);
  }
  public async checkByParams(params: FilterQuery<IToken>): Promise<IToken> {
    return await Token.findOne(params);
  }
  public async deleteById(id: string): Promise<void> {
    await Token.deleteMany({ _id: id });
  }
  public async deleteByMe(id: string): Promise<void> {
    await Token.deleteMany({ _userId: id });
  }
}

export const tokenRepository = new TokenRepository();
