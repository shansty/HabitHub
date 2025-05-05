import React, { useRef, useState } from 'react'
import { useGetUserFriendsInfiniteQuery } from '../../../../services/friendship'
import ErrorHandling from '../../../../common_components/error_handling';
import InfiniteScroll from 'react-infinite-scroller';
import { useClickOutside } from '../../../../hooks';
import FriendSettings from './friend_settings';


const FriendList: React.FC = () => {
    const [customError, setCustomError] = useState<string | null>(null)
    const [openMenuId, setOpenMenuId] = useState<number | null>(null)
    const { data: friends, isLoading, isError, fetchNextPage, hasNextPage } = useGetUserFriendsInfiniteQuery()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const allFriends = friends?.pages.flatMap((page) => page.friends) ?? [];
    useClickOutside(dropdownRef, () => setOpenMenuId(null))

    const handleMenuClose = () => setOpenMenuId(null)
    const handleMenuOpen = (id: number) => setOpenMenuId(id)

    if (isLoading) return <p className="text-gray-500 text-sm">Loading friends...</p>
    if (isError) return <p><ErrorHandling customError={customError} /></p>
    if (!friends || allFriends.length === 0)
        return <p className="text-gray-500 text-sm">You have no friends yet.</p>

    return (
        <div className="space-y-2 min-h-20"
            style={{
                maxHeight: '300px',
                overflowY: 'auto',
            }}>
            {customError && (
                <p className="text-sm text-red-500">Failed to delete friend.</p>
            )}
            <InfiniteScroll
                loadMore={fetchNextPage}
                hasMore={hasNextPage}
                loader={<div key="loader">Loading...</div>}
                useWindow={false}
            >
                {allFriends.map((friend) => (
                    <div key={friend.id} className="relative p-2 rounded hover:bg-gray-100 flex justify-between items-center">
                        <span className="flex items-center gap-2">
                            👤 {friend.username}
                        </span>
                        <button
                            onClick={() =>
                                openMenuId === friend.id
                                    ? handleMenuClose()
                                    : handleMenuOpen(friend.id)
                            }
                            className="text-md py-1 text-indigo-800 transition w-7 rounded-md cursor-pointer"
                        >
                            ⋮
                        </button>
                        {openMenuId === friend.id && (
                            <div
                                ref={dropdownRef}
                                className="absolute right-2 top-8 w-20 bg-white border border-indigo-700 rounded-md shadow-lg z-50"

                            >
                                <FriendSettings
                                    friendId={friend.id}
                                    setCustomError={setCustomError}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}

export default FriendList
