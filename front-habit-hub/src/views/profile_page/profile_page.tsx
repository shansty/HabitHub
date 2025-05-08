import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenValid } from '../../utils';
import Modal from '../../common_components/modal_notification';
import UserData from '../profile_page/components/user_data';
import HabitForm from './components/forms/habit_form';
import { format, isToday, isTomorrow } from 'date-fns';
import { useLazyGetUserHabitsByDateQuery } from '../../services/habit';
import 'react-datepicker/dist/react-datepicker.css';
import { useClickOutside } from '../../hooks';
import HabitList from '../profile_page/components/habit_list';
import SearchUsers from './components/search/search';
import FriendNotificationTabs from './components/feed/users_tabs';
import DateActionBar from './components/date_action_buttons';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpened, setIsFormOpened] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [showDesktopCalendar, setShowDesktopCalendar] = useState(false);
  const [getHabits, { data }] = useLazyGetUserHabitsByDateQuery();

  const mobileCalendarRef = useRef<HTMLDivElement>(null);
  const desktopCalendarRef = useRef<HTMLDivElement>(null);

  useClickOutside(mobileCalendarRef, () => setShowMobileCalendar(false));
  useClickOutside(desktopCalendarRef, () => setShowDesktopCalendar(false));

  const isValid = isTokenValid(token);

  useEffect(() => {
    if (!token || !isValid) {
      setIsModalOpen(true);
    }
  }, [token, isValid]);

  useEffect(() => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    getHabits(formattedDate);
  }, [selectedDate]);

  const handleOnModalClose = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  const getDateLabel = () => {
    if (isToday(selectedDate)) return 'Today';
    if (isTomorrow(selectedDate)) return 'Tomorrow';
    return format(selectedDate, 'yyyy-MM-dd');
  };

  return (
    <div className="min-h-screen bg-blue-800 flex center justify-center">
      <div className="w-full max-w-350 bg-white rounded-xl p-8 space-y-3 mt-20 mb-20">
        {(!token || !isValid) && isModalOpen && (
          <Modal
            onClose={handleOnModalClose}
            isOpen={true}
            title="Your session has expired"
            message="You need to log in to access the data"
          />
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <UserData />
          <SearchUsers />
          <div className="hidden sm:block">
            <DateActionBar
              selectedDate={selectedDate}
              showCalendar={showDesktopCalendar}
              onToggleCalendar={() => setShowDesktopCalendar(!showDesktopCalendar)}
              onDateChange={(date) => {
                setSelectedDate(date);
                setShowDesktopCalendar(false);
              }}
              onAddHabit={() => setIsFormOpened(true)}
              calendarRef={desktopCalendarRef}
              getDateLabel={getDateLabel}
            />
          </div>
        </div>

        {isFormOpened && (
          <HabitForm
            onClose={() => setIsFormOpened(false)}
            minStartDate={new Date()}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <div className="md:col-span-2">
            <FriendNotificationTabs />
          </div>
          <div className="block sm:hidden md:col-span-6">
            <DateActionBar
              selectedDate={selectedDate}
              showCalendar={showMobileCalendar}
              onToggleCalendar={() => setShowMobileCalendar(!showMobileCalendar)}
              onDateChange={(date) => {
                setSelectedDate(date);
                setShowMobileCalendar(false);
              }}
              onAddHabit={() => setIsFormOpened(true)}
              calendarRef={mobileCalendarRef}
              getDateLabel={getDateLabel}
            />
          </div>
          <div className="md:col-span-4">
            <HabitList habits={data} selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
