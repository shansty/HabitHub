import React, { useState, useEffect, useRef } from 'react';
import { useSearchUsersQuery } from '../../../../services/user';
import { useSendFriendRequestMutation } from '../../../../services/friendship';
import { useClickOutside } from '../../../../hooks';
import { Search } from 'lucide-react';
import { getIDFromToken, getToken } from '../../../../utils';
import Modal from '../../../../common_components/modal_notification';
import ErrorHandling from '../../../../common_components/error_handling';
import SearchUserItem from './search_item';

const SearchUsers: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const debounceDelay = 500;
    const [showDropdown, setShowDropdown] = useState(false);
    const [sendingFriendId, setSendingFriendId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [customError, setCustomError] = useState<string | null>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);

    const { data, isLoading: isSearching } = useSearchUsersQuery(debouncedSearchTerm, {
        skip: debouncedSearchTerm.length < 2,
    });
    const [sendFriendRequest, { isLoading: isSendingFriendRequest }] = useSendFriendRequestMutation();
    const double_sending_request_message = "Waiting for friend request to be accepted."

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, debounceDelay);
        setShowDropdown(true);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        setCustomError(null)
    }, [searchTerm]);

    useClickOutside(inputWrapperRef, () => {
        setShowDropdown(false);
    });

    const handleAddFriend = async (receiverId: number) => {
        try {
            setSendingFriendId(receiverId);
            const token = getToken();
            const senderId = getIDFromToken(token);
            await sendFriendRequest({ senderId: senderId as number, receiverId }).unwrap();
            setModalMessage('Friendship request sent!');
            setShowModal(true);
            setCustomError(null);
        } catch (err: any) {
            setCustomError(err?.data?.message)
        } finally {
            setSendingFriendId(null);
        }
    };

    const handleOnModalClose = () => {
        setShowModal(false);
    };

    return (
        <div ref={inputWrapperRef} className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 right-2 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-indigo-600" />
            </div>

            <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Find Friends"
                className="w-full px-4 py-2 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10"
            />

            {showModal && (
                <Modal
                    onClose={handleOnModalClose}
                    isOpen={true}
                    title="Success"
                    message={modalMessage}
                />
            )}

            {showDropdown && (
                <div className="absolute z-10 w-full bg-white rounded-md mt-2 max-h-60 overflow-y-auto shadow-lg">
                    {double_sending_request_message == customError && customError ?
                        <p className="text-indigo-900 text-sm text-center mt-1">{double_sending_request_message}</p>
                        : <ErrorHandling customError={customError} />
                    }

                    {isSearching && (
                        <p className="text-sm text-gray-500 p-2">Loading...</p>
                    )}

                    {data?.map((friendship) => (
                        <SearchUserItem
                            key={friendship.id}
                            friendship={friendship}
                            handleAddFriend={handleAddFriend}
                            isSendingFriendRequest={isSendingFriendRequest}
                            sendingFriendId={sendingFriendId}
                        />
                    ))}

                    {debouncedSearchTerm && !isSearching && data?.length === 0 && (
                        <p className="text-sm text-gray-500 p-2">No users found...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchUsers;
