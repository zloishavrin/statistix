interface IAuthHeader extends Headers {
  userId?: string;
}

export interface IAuthRequest extends Request {
  headers: IAuthHeader;
}
