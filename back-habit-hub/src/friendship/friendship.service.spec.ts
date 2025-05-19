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

    describe('getUserIdsOrder', () => {
        it('should return ids in ascending order', () => {
            expect((service as any).getUserIdsOrder(2, 1)).toEqual([1, 2]);
            expect((service as any).getUserIdsOrder(1, 2)).toEqual([1, 2]);
            expect((service as any).getUserIdsOrder(3, 3)).toEqual([3, 3]);
        });

        it("getUserIdsOrder gets undefind", () => {
            expect((service as any).getUserIdsOrder(undefined, 1)).toEqual([1, 2]);
        })
    });
});
