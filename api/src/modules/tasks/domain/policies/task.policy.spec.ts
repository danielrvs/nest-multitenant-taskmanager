import { TaskPolicy } from "./task.policy";
import { Task } from "../entities/task.entity";
import { UserRole } from "@/modules/users/domain/entities/enums/user-role.enum";
import { TaskStatus } from "../entities/enums/task-status.enum";
import { TaskPriority } from "../entities/enums/task-priority.enum";
import { Authenticated } from "@/modules/auth/domain/interfaces/authenticated.interface";
import { ForbiddenException } from "@nestjs/common";

describe('TaskPolicy Unit Tests', () => {
    const tenantId = 'tenant-1';
    const otherTenantId = 'tenant-2';

    const createMockUser = (userId: string, role: UserRole, userTenantId: string = tenantId): Authenticated => ({
        userId,
        role,
        tenantId: userTenantId,
        name: 'Test User',
        email: 'test@example.com',
        isMfaPending: false,
    });

    const createMockTask = (userId: string, taskTenantId: string = tenantId): Task => {
        return new Task(
            'task-1',
            taskTenantId,
            userId,
            'Task Title',
            'Description',
            TaskStatus.IN_PROGRESS,
            TaskPriority.HIGH,
            null,
            null,
            new Date(),
            new Date()
        );
    };

    describe('isUserAuthorizedToCreate', () => {
        it('should allow ADMIN to create tasks in their own tenant', () => {
            const admin = createMockUser('user-admin', UserRole.ADMIN);
            expect(() => TaskPolicy.isUserAuthorizedToCreate(admin, tenantId)).not.toThrow();
        });

        it('should allow MANAGER to create tasks in their own tenant', () => {
            const manager = createMockUser('user-manager', UserRole.MANAGER);
            expect(() => TaskPolicy.isUserAuthorizedToCreate(manager, tenantId)).not.toThrow();
        });

        it('should NOT allow VIEWER to create tasks', () => {
            const viewer = createMockUser('user-viewer', UserRole.VIEWER);
            expect(() => TaskPolicy.isUserAuthorizedToCreate(viewer, tenantId)).toThrow(ForbiddenException);
        });

        it('should NOT allow access across different tenants', () => {
            const admin = createMockUser('user-admin', UserRole.ADMIN, otherTenantId);
            expect(() => TaskPolicy.isUserAuthorizedToCreate(admin, tenantId)).toThrow(ForbiddenException);
        });
    });

    describe('isUserAuthorizedToUpdate', () => {
        it('should allow ADMIN to update any task in their tenant', () => {
            const admin = createMockUser('user-admin', UserRole.ADMIN);
            const task = createMockTask('user-other');
            expect(() => TaskPolicy.isUserAuthorizedToUpdate(admin, task)).not.toThrow();
        });

        it('should allow MANAGER to update their own task', () => {
            const manager = createMockUser('user-manager', UserRole.MANAGER);
            const task = createMockTask('user-manager');
            expect(() => TaskPolicy.isUserAuthorizedToUpdate(manager, task)).not.toThrow();
        });

        it('should NOT allow MANAGER to update other users tasks', () => {
            const manager = createMockUser('user-manager', UserRole.MANAGER);
            const task = createMockTask('user-other');
            expect(() => TaskPolicy.isUserAuthorizedToUpdate(manager, task)).toThrow(ForbiddenException);
        });

        it('should NOT allow VIEWER to update tasks', () => {
            const viewer = createMockUser('user-viewer', UserRole.VIEWER);
            const task = createMockTask('user-viewer');
            expect(() => TaskPolicy.isUserAuthorizedToUpdate(viewer, task)).toThrow(ForbiddenException);
        });

        it('should NOT allow cross-tenant updates', () => {
            const admin = createMockUser('user-admin', UserRole.ADMIN, otherTenantId);
            const task = createMockTask('user-admin', tenantId);
            expect(() => TaskPolicy.isUserAuthorizedToUpdate(admin, task)).toThrow(ForbiddenException);
        });
    });

    describe('isUserAuthorizedToDelete', () => {
        it('should allow ADMIN to delete any task in their tenant', () => {
            const admin = createMockUser('user-admin', UserRole.ADMIN);
            const task = createMockTask('user-other');
            expect(() => TaskPolicy.isUserAuthorizedToDelete(admin, task)).not.toThrow();
        });

        it('should allow MANAGER to delete their own task', () => {
            const manager = createMockUser('user-manager', UserRole.MANAGER);
            const task = createMockTask('user-manager');
            expect(() => TaskPolicy.isUserAuthorizedToDelete(manager, task)).not.toThrow();
        });

        it('should NOT allow MANAGER to delete other users tasks', () => {
            const manager = createMockUser('user-manager', UserRole.MANAGER);
            const task = createMockTask('user-other');
            expect(() => TaskPolicy.isUserAuthorizedToDelete(manager, task)).toThrow(ForbiddenException);
        });

        it('should NOT allow VIEWER to delete tasks', () => {
            const viewer = createMockUser('user-viewer', UserRole.VIEWER);
            const task = createMockTask('user-viewer');
            expect(() => TaskPolicy.isUserAuthorizedToDelete(viewer, task)).toThrow(ForbiddenException);
        });
    });

    describe('isUserAuthorizedToView', () => {
        it('should allow viewing within the same tenant', () => {
            const viewer = createMockUser('user-viewer', UserRole.VIEWER);
            const task = createMockTask('user-other');
            expect(() => TaskPolicy.isUserAuthorizedToView(viewer, task)).not.toThrow();
        });

        it('should NOT allow viewing across different tenants', () => {
            const viewer = createMockUser('user-viewer', UserRole.VIEWER, otherTenantId);
            const task = createMockTask('user-other', tenantId);
            expect(() => TaskPolicy.isUserAuthorizedToView(viewer, task)).toThrow(ForbiddenException);
        });
    });
});
