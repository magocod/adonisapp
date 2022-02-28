export const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
export const API_KEY = 'Bearer'

export enum UserRoleIds {
  ROOT = 1,
  ADMIN,
  USER,
}
