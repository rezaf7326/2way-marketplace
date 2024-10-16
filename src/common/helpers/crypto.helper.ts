import { ConfigContainer } from '../config';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class CryptoHelper {
  private static readonly encryptionKey =
    ConfigContainer.config().general.encKey;
  private static readonly algorithm = 'aes-256-ctr';
  private static readonly iv = crypto.randomBytes(16);
  private static readonly saltRounds = 10;

  static uuid(): string {
    return crypto.randomUUID();
  }

  static randomHex(bytes: number): string {
    return crypto.randomBytes(bytes).toString('hex');
  }

  static hash(text: string): Promise<string> {
    return bcrypt.hash(text, this.saltRounds);
  }

  static compareHash(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }

  static encrypt(
    plainText: string,
    plainTextEncoding: crypto.Encoding = 'utf8',
    cipherTextEncoding: crypto.Encoding = 'hex',
  ): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.encryptionKey,
      this.iv,
    );

    return (
      cipher.update(plainText, plainTextEncoding, cipherTextEncoding) +
      cipher.final(cipherTextEncoding)
    );
  }

  static decrypt(
    cipherText: string,
    cipherTextEncoding: crypto.Encoding = 'hex',
    decryptedTextEncoding: crypto.Encoding = 'utf8',
  ): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.encryptionKey,
      this.iv,
    );

    return (
      decipher.update(cipherText, cipherTextEncoding, decryptedTextEncoding) +
      decipher.final(decryptedTextEncoding)
    );
  }
}
