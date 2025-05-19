import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FriendshipService } from './friendship.service';
import { Friendship } from './entities/friendship.entity';
import { NotificationService } from '../notification/notification.service';

describe('FriendshipService', () => {
    let service: FriendshipService;

    const mockFriendshipRepository = {};
    const mockNotificationService = {};

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FriendshipService,
                {
                    provide: getRepositoryToken(Friendship),
                    useValue: mockFriendshipRepository,
                },
                {
                    provide: NotificationService,
                    useValue: mockNotificationService,
                },
            ],
        }).compile();

        service = module.get<FriendshipService>(FriendshipService);
    });

    describe('getNumbersOrder', () => {
        it('should return numbers in ascending order', () => {
            expect((service as any).getNumbersOrder(2, 1)).toEqual([1, 2]);
            expect((service as any).getNumbersOrder(1, 2)).toEqual([1, 2]);
            expect((service as any).getNumbersOrder(3, 3)).toEqual([3, 3]);
        });

        it('should throw Invalid input when passed not number', () => {
            expect(() => service.getNumbersOrder(undefined as any, 1)).toThrow('Invalid input');
            expect(() => service.getNumbersOrder(null as any, 1)).toThrow('Invalid input');
        });
    });
});
