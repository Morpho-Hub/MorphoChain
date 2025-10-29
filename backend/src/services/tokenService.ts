import { Token, IToken } from '../models/token';

export class TokenService {
  static async createToken(tokenData: Partial<IToken>): Promise<IToken> {
    const token = new Token(tokenData);
    return await token.save();
  }

  static async getTokenById(id: string): Promise<IToken | null> {
    return await Token.findById(id)
      .populate('fincaId')
      .populate('ownerId');
  }

  static async getTokenByBlockchainId(tokenIdBlockchain: string): Promise<IToken | null> {
    return await Token.findOne({ tokenIdBlockchain })
      .populate('fincaId')
      .populate('ownerId');
  }

  static async getAllTokens(): Promise<IToken[]> {
    return await Token.find()
      .populate('fincaId')
      .populate('ownerId')
      .sort({ createdAt: -1 });
  }

  static async getTokensByFinca(fincaId: string): Promise<IToken[]> {
    return await Token.find({ fincaId })
      .populate('fincaId')
      .populate('ownerId')
      .sort({ createdAt: -1 });
  }

  static async getTokensByOwner(ownerId: string): Promise<IToken[]> {
    return await Token.find({ ownerId })
      .populate('fincaId')
      .populate('ownerId')
      .sort({ createdAt: -1 });
  }

  static async updateToken(id: string, updateData: Partial<IToken>): Promise<IToken | null> {
    return await Token.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate('fincaId')
    .populate('ownerId');
  }

  static async deleteToken(id: string): Promise<IToken | null> {
    return await Token.findByIdAndDelete(id);
  }

  static async addTransferToHistory(
    tokenId: string, 
    transferData: { from: string; to: string; date: Date; price: number }
  ): Promise<IToken | null> {
    return await Token.findByIdAndUpdate(
      tokenId,
      { 
        $push: { transferHistory: transferData },
        ownerId: transferData.to, // Update current owner
        updatedAt: new Date()
      },
      { new: true }
    )
    .populate('fincaId')
    .populate('ownerId');
  }

  static async updateTokenStatus(id: string, status: string): Promise<IToken | null> {
    return await Token.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    )
    .populate('fincaId')
    .populate('ownerId');
  }
}