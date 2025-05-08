import { AppDataSource } from '../../data-source'
import { User } from "../user_module/users/entities/users.entity"
import { Friendship } from "../friendship/entities/friendship.entity"
import { ILike, In } from 'typeorm'

async function seed() {
    await AppDataSource.initialize()

    const userRepo = AppDataSource.getRepository(User)
    const friendshipRepo = AppDataSource.getRepository(Friendship)

    // const usersToDelete = await userRepo.find({
    //     where: { username: ILike('user%') },
    // })

    // const userIdsToDelete = usersToDelete.map(user => user.id)

    // if (userIdsToDelete.length) {
    //     await friendshipRepo
    //         .createQueryBuilder()
    //         .delete()
    //         .where("user1Id IN (:...ids) OR user2Id IN (:...ids)", { ids: userIdsToDelete })
    //         .execute()

    //     console.log(` Deleted friendships for ${userIdsToDelete.length} users`)
    //     await userRepo.delete({ id: In(userIdsToDelete) })
    // }


    const userData = Array.from({ length: 10 }).map((_, i) => ({
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: 'Password123!',
        isVerified: true,
    }))
    const createdUsers = await userRepo.save(userData)
    console.log(`Created ${createdUsers.length} users`)

    // const friendships: Partial<Friendship>[] = []

    // for (const user of createdUsers) {
    //     if (user.id === 65) continue
    //     const [user1Id, user2Id] =
    //         user.id < 65 ? [user.id, 65] : [65, user.id]
    //     friendships.push(
    //         friendshipRepo.create({
    //             user1: { id: user1Id } as User,
    //             user2: { id: user2Id } as User,
    //             isAccepted: true,
    //         })
    //     )
    // }
    // await friendshipRepo.save(friendships)
}
seed().catch((err) => {
    console.error(' Seeding error:', err)
    process.exit(1)
})

