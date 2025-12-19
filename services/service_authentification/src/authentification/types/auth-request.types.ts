interface IAuthHeader extends Headers {
  authorization?: string;
}

export interface IAuthRequest extends Request {
  headers: IAuthHeader;
}
