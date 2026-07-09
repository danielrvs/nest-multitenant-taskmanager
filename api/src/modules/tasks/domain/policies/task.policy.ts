
import { Task } from "../entities/task.entity";
import { Authenticated } from "@/modules/auth/domain/interfaces/authenticated.interface";
import { UserRole } from "@/modules/users/domain/entities/enums/user-role.enum";
import { ForbiddenException } from "@nestjs/common";

export class TaskPolicy {
    static isUserAuthorizedToCreate(currentUser: Authenticated, tenantId: string): void {
        this.ensureSameTenant(currentUser.tenantId, tenantId);
        if (![UserRole.ADMIN, UserRole.MANAGER].includes(currentUser.role)) {
            throw new ForbiddenException('User is not authorized to perform this action');
        }
    }

    static isUserAuthorizedToUpdate(currentUser: Authenticated, task: Task): void {
        this.ensureSameTenant(currentUser.tenantId, task.tenantId);
        
        if (currentUser.role === UserRole.VIEWER) {
            throw new ForbiddenException('User is not authorized to perform this action');
        }

        if(currentUser.role === UserRole.MANAGER && task.userId !== currentUser.userId) {
            throw new ForbiddenException('Managers can only update their own tasks');
        }

    }

    static isUserAuthorizedToDelete(currentUser: Authenticated, task: Task): void {
        this.ensureSameTenant(currentUser.tenantId, task.tenantId);

        if (currentUser.role === UserRole.VIEWER) {
            throw new ForbiddenException('User is not authorized to perform this action');
        }

        if(currentUser.role === UserRole.MANAGER && task.userId !== currentUser.userId) {
            throw new ForbiddenException('Managers can only delete their own tasks');
        }
    }

    static isUserAuthorizedToView(currentUser: Authenticated, task: Task): void {
        this.ensureSameTenant(currentUser.tenantId, task.tenantId);
    }


    private static ensureSameTenant(userTenantId: string, taskTenantId: string): void {
        if (taskTenantId !== userTenantId) {
            throw new ForbiddenException('Cannot access tasks from another tenant');
        }
    }

}