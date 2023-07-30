import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '@/app/repositories/UserRepository';
import { UserSaveRequest } from '@/app/domains/DTOs/UserSaveRequest';
import { RoleRepository } from '@/app/repositories/RoleRepository';
import { RepositoryException } from '@/app/domains/types/RepositoryException';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

    async saveUserV1(userSaveRequest: UserSaveRequest): Promise<string> {
        await this.validateRole(userSaveRequest.roleId);
        await this.validateEmail(userSaveRequest.email);

        const insertResult = await this.userRepository.insert({
            email: userSaveRequest.email,
            role: {
                id: userSaveRequest.roleId,
            },
        });

        return insertResult.generatedMaps[0].id;
    }

    private async validateRole(roleId: string): Promise<void> {
        const isRoleExist = await this.roleRepository.exist({ where: { id: roleId } });
        if (!isRoleExist) {
            throw new UnprocessableEntityException(`Invalid role ID`);
        }
    }

    private async validateEmail(email: string): Promise<void> {
        const isUserWithEmailExist = await this.userRepository.exist({ where: { email: email } });
        if (isUserWithEmailExist) {
            throw new ConflictException(`Email is associated with another user`);
        }
    }

    async saveUserV2(userSaveRequest: UserSaveRequest): Promise<string> {
        try {
            const insertResult = await this.userRepository.insert({
                email: userSaveRequest.email,
                role: {
                    id: userSaveRequest.roleId,
                },
            });
            return insertResult.generatedMaps[0].id;
        } catch (error) {
            this.handleRepositoryException(error);
            throw error;
        }
    }

    private handleRepositoryException(repositoryException: RepositoryException): void {
        const errorMap: Record<string, Error> = {
            UQ_User_email: new ConflictException(`Email is associated with another user`),
            FK_User_roleId_Role_id: new UnprocessableEntityException(`Invalid role ID`),
        };
        throw errorMap[repositoryException.constraint];
    }
}
