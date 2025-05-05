import React, { useState } from 'react'
import { useGetUserNotificationsInfiniteQuery } from '../../../../services/notification'
import InfiniteScroll from 'react-infinite-scroller'
import ErrorHandling from '../../../../common_components/error_handling'
import { NotificationType } from '../../../../enums'
import { Check, X } from 'lucide-react'
import { useAcceptFriendshipRequestMutation, useRejectFriendshipRequestMutation } from '../../../../services/notification'

const NotificationList: React.FC = () => {
    const [customError, setCustomError] = useState<string | null>(null)
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetUserNotificationsInfiniteQuery()
    const [acceptFriendshipRequest] = useAcceptFriendshipRequestMutation();
    const [rejectFriendshipRequest] = useRejectFriendshipRequestMutation();
    const allNotifications = data?.pages.flatMap(page => page.notifications) ?? []

    const handleAccept = async (notificationId: number, senderId: number) => {
        try {
            await acceptFriendshipRequest({ notificationId, senderId }).unwrap();
        } catch (err: any) {
            setCustomError(err?.data?.message)
        }
    }

    const handleReject = async (notificationId: number, senderId: number) => {
        try {
            await rejectFriendshipRequest({ notificationId, senderId }).unwrap();
        } catch (err: any) {
            setCustomError(err?.data?.message)
        }
    }

    if (isLoading) return <p className="text-sm text-gray-500">Loading notifications...</p>
    if (isError) return <ErrorHandling customError={customError} />
    if (!allNotifications.length)
        return <p className="text-sm text-gray-500">You have no notifications.</p>

    return (
        <div className="space-y-2 min-h-20"
            style={{
                maxHeight: '300px',
                overflowY: 'auto',
            }}>
            <InfiniteScroll
                loadMore={fetchNextPage}
                hasMore={hasNextPage}
                useWindow={false}
                loader={<div className="text-center text-xs text-gray-400">Loading more...</div>}
            >
                {allNotifications.map(notification => (
                    <div
                        key={notification.id}
                        className={`relative p-2 rounded flex justify-between items-center`}
                    >
                        <div className="text-sm flex flex-col">
                            <span>{notification.message}</span>
                        </div>
                        {notification.type === NotificationType.RECEIVE_FRIENDSHIP_REQUEST &&
                            <div>
                                <button
                                    onClick={() => handleAccept(notification.id, notification.senderId)}
                                    className='text-green-500 cursor-pointer'
                                ><Check />
                                </button>
                                <button
                                    onClick={() => handleReject(notification.id, notification.senderId)}
                                    className='text-red-500 cursor-pointer'>
                                    <X />
                                </button>
                            </div>
                        }
                    </div>
                ))}
                {isFetchingNextPage && <div className="text-xs text-center">Fetching more...</div>}
            </InfiniteScroll>
        </div>
    )
}

export default NotificationList
