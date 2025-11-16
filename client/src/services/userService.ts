import { api, ApiResponse } from './api';

export interface PublicUser {
  _id: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'farmer' | 'investor' | 'admin';
  walletAddress?: string;
  profilePicture?: string;
}

class UserService {
  async getPublicById(id: string): Promise<ApiResponse<PublicUser>> {
    return api.get<PublicUser>(`/users/public/${id}`);
  }
}

export const userService = new UserService();
