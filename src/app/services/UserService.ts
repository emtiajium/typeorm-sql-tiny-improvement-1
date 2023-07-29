import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@/app/repositories/UserRepository';
import { UserSaveRequest } from '@/app/domains/DTOs/UserSaveRequest';
import { User } from '@/app/domains/entities/User';
import { RoleRepository } from '@/app/repositories/RoleRepository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly roleRepository: RoleRepository) {}

    async saveUserV1(userSaveRequest: UserSaveRequest): Promise<User> {
        const isRoleExist = await this.roleRepository.exist({ where: { id: userSaveRequest.roleId } });
        if (!isRoleExist) {
            throw new NotFoundException(`Invalid role "${userSaveRequest.roleId}"`);
        }

        const isUserWithEmailExist = await this.userRepository.exist({ where: { email: userSaveRequest.email } });
        if (isUserWithEmailExist) {
            throw new ConflictException(`Email "${userSaveRequest.email}" is associated with another user`);
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
}
