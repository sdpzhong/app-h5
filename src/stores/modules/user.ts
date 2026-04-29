import { defineStore } from 'pinia';
import { router } from '@/router';
import { PageEnum } from '@/constants/enums/pageEnum';
import { getCacheToken, setCacheToken } from '../auth';

export interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  refreshToken?: string;
  userStatus: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    userInfo: null,
    token: undefined,
    refreshToken: undefined,
    userStatus: 0,
  }),
  getters: {
    getUserInfo(): Nullable<UserInfo> {
      return this.userInfo;
    },
    getToken(): string {
      if (!this.token) {
        this.token = getCacheToken();
      }
      return this.token || '';
    },
  },
  actions: {
    async afterLoginAction() {
      try {
        await router.replace(
          (router.currentRoute.value.query.redirect as string) || PageEnum.BASE_HOME,
        );
      } catch (error) {
        return Promise.reject(error);
      }
    },

    setToken(token: string) {
      this.token = token || '';
      setCacheToken(this.token);
    },
  },
});
