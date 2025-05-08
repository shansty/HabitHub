import React, { useState } from 'react'
import FriendList from './friends_list'
import NotificationList from './notification_list'


const FriendNotificationTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'friends' | 'notifications'>('friends')

    return (
        <div className="w-full p-4">
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setActiveTab('friends')}
                    className={`px-4 py-1 rounded-md font-medium cursor-pointer ${activeTab === 'friends'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 hover:bg-indigo-200'
                        }`}
                >
                    Friends
                </button>
                <button
                    onClick={() => setActiveTab('notifications')}
                    className={`px-4 py-1 rounded-md font-medium cursor-pointer ${activeTab === 'notifications'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-900 hover:bg-indigo-200'
                        }`}
                >
                    Notifications
                </button>
            </div>
            <div className="text-sm text-gray-800 space-y-2">
                {activeTab === 'friends' &&
                    <FriendList/>
                }

                {activeTab === 'notifications' &&
                    <NotificationList />
                    }
            </div>
        </div>
    )
}

export default FriendNotificationTabs
