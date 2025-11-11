import { HashGenerator } from '@/domain/aplication/cryptography/hash-generator';
import { HashComparer } from '@/domain/aplication/cryptography/hash-comparer';

import { Module } from '@nestjs/common';
import { BcryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HashComparer, useClass: BcryptHasher },
  ],
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
