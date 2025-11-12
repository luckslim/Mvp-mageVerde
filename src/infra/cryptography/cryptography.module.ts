import { HashGenerator } from '@/domain/aplication/cryptography/hash-generator';
import { HashComparer } from '@/domain/aplication/cryptography/hash-comparer';

import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';
import { Encrypter } from '@/domain/aplication/cryptography/encrypter';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  providers: [
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [HashGenerator, HashComparer, Encrypter],
})
export class CryptographyModule {}
