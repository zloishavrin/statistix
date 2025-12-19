import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
} from "crypto";

import { IEncryptedData } from "./types/encrypted-data.types";

@Injectable()
export class CryptService {
  private IV_LENGTH = 16;
  private ENCRYPT_KEY: Buffer;
  private HASH_SECRET: string;
  private PASSWORD_SALT_ROUNDS = 12;

  constructor(private readonly configService: ConfigService) {
    const encryptSecret =
      this.configService.get<string>("crypt.encryptSecret") || "encrypt-secret";

    this.ENCRYPT_KEY = createHash("sha256").update(encryptSecret).digest();
    this.HASH_SECRET =
      this.configService.get<string>("crypt.hashSecret") || "hash-secret";
  }

  /**
   * Generation encrypted text
   * @param text Text
   * @returns Encrypted text and iv
   */
  encryptText(text: string): IEncryptedData<string> {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv("aes-256-cbc", this.ENCRYPT_KEY, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return {
      data: encrypted,
      iv: iv.toString("hex"),
    };
  }

  /**
   * Decryption text
   * @param encryptedData Encrypted text and iv
   * @returns Encrypted text
   */
  decryptText(encryptedData: IEncryptedData<string>): string {
    const decipher = createDecipheriv(
      "aes-256-cbc",
      this.ENCRYPT_KEY,
      Buffer.from(encryptedData.iv, "hex"),
    );
    let decrypted = decipher.update(encryptedData.data, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  }

  /**
   * Generation HMAC
   * @param text Text
   * @returns HMAC
   */
  getHmac(text: string): string {
    const hash = createHmac("sha256", this.HASH_SECRET)
      .update(text)
      .digest("hex");
    return hash;
  }

  /**
   * Generation hash password
   * @param password Password
   * @returns Hash
   */
  async getPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, this.PASSWORD_SALT_ROUNDS);
  }

  /**
   * Compare password with hash
   * @param password Password
   * @param hash Hash
   * @returns Flag is equal
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
