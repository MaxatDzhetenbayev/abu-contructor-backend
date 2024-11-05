// jwt-payload.interface.ts
export interface JwtPayload {
  sub: number; // или string, в зависимости от типа вашего ID
  username: string;
}
