import { Module } from '@nestjs/common';
import { EncryptionService } from './enctryption.service.js';
import { HashService } from './hash.service.js';

@Module({
    providers: [
        EncryptionService,
        HashService
    ],
    exports: [
        EncryptionService,
        HashService
    ]
})
export class SecurityModule { }
