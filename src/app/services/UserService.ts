import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/app/repositories/UserRepository';
import { UserSaveRequest } from '@/app/domains/DTOs/UserSaveRequest';
import { User } from '@/app/domains/entities/User';
import { RoleRepository } from '@/app/repositories/RoleRepository';
import { RepositoryException } from '@/app/domains/types/RepositoryException';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

    async saveUserV1(userSaveRequest: UserSaveRequest): Promise<User> {
        const isRoleExist = await this.roleRepository.exist({ where: { id: userSaveRequest.roleId } });
        if (!isRoleExist) {
            throw new NotFoundException(`Invalid role ID`);
        }

        const isUserWithEmailExist = await this.userRepository.exist({ where: { email: userSaveRequest.email } });
        if (isUserWithEmailExist) {
            throw new ConflictException(`Email is associated with another user`);
        }

        return this.userRepository.save(
            this.userRepository.create({
                email: userSaveRequest.email,
                role: {
                    id: userSaveRequest.roleId,
                },
            }),
        );
    }

    async saveUserV2(userSaveRequest: UserSaveRequest): Promise<User> {
        try {
            return await this.userRepository.save(
                this.userRepository.create({
                    email: userSaveRequest.email,
                    role: {
                        id: userSaveRequest.roleId,
                    },
                }),
            );
        } catch (error) {
            this.handleRepositoryException(error);
            throw error;
        }
    }

    private handleRepositoryException(repositoryException: RepositoryException): void {
        if (repositoryException.constraint === `UQ_User_email`) {
            throw new ConflictException(`Email is associated with another user`);
        }
        if (/Key \(roleId\)=\([\w-]{36}\) is not present in table "Role"./u.test(repositoryException.detail)) {
            throw new NotFoundException(`Invalid role ID`);
        }
    }
}
