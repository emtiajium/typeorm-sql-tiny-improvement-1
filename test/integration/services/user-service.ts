import { INestApplication } from '@nestjs/common';
import { kickOff } from '@/bootstrap';
import { AppModule } from '@/app/AppModule';
import { UserSaveRequest } from '@/app/domains/DTOs/UserSaveRequest';
import * as uuid from 'uuid';
import { UserService } from '@/app/services/UserService';
import { UserRepository } from '@/app/repositories/UserRepository';
import { RoleRepository } from '@/app/repositories/RoleRepository';

describe('UserService', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await kickOff(AppModule);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('saveUserV1()', () => {
        it('SHOULD throw an error WHEN roleId is invalid', async () => {
            // Arrange
            const userSaveRequest: UserSaveRequest = {
                email: `random+${uuid.v4()}@firecrackervocabulary.com`,
                roleId: uuid.v4(),
            };

            // Act & Assert
            await expect(app.get(UserService).saveUserV1(userSaveRequest)).rejects.toThrowError(
                `Invalid role "${userSaveRequest.roleId}"`,
            );
        });

        it('SHOULD throw an error WHEN email is taken', async () => {
            // Arrange
            const userSaveRequest: UserSaveRequest = {
                email: `random+${uuid.v4()}@firecrackervocabulary.com`,
                roleId: uuid.v4(),
            };
            await app.get(RoleRepository).insert({
                id: userSaveRequest.roleId,
            });
            await app.get(UserRepository).insert({
                email: userSaveRequest.email,
                role: { id: userSaveRequest.roleId },
            });

            // Act & Assert
            await expect(app.get(UserService).saveUserV1(userSaveRequest)).rejects.toThrowError(
                `Email "${userSaveRequest.email}" is associated with another user`,
            );
        });

        it('SHOULD return the user WHEN the payload is valid', async () => {
            // Arrange
            const userSaveRequest: UserSaveRequest = {
                email: `random+${uuid.v4()}@firecrackervocabulary.com`,
                roleId: uuid.v4(),
            };
            await app.get(RoleRepository).insert({
                id: userSaveRequest.roleId,
            });

            // Act
            const user = await app.get(UserService).saveUserV1(userSaveRequest);

            // Assert
            expect(user.id).toBeDefined();
        });
    });
});
