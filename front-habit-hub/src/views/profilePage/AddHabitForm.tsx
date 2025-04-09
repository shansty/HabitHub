import React, { useState } from 'react';
import InputField from '../authPage/utils_components/InputField';

// interface HabitFormProps {
//     onClose: () => void;
//     onSave?: (formData: any) => void;
// }

const categories = ['Fitness', 'Finance', 'Nutrition', 'Mindset'];
const units = ['Times', 'Mins', 'Hours'];
const repeatOptions = ['Daily', 'Weekly', 'Monthly'];
const habitSchedule = ['Per day', 'Per week', 'Per month']

// const HabitFormModal: React.FC<HabitFormProps> = ({ onClose, onSave }) => {

const HabitFormModal: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [goal, setGoal] = useState(1);
    const [goalDuration, setGoalDuration] = useState(21);
    const [unit, setUnit] = useState('Times');
    const [schedule, setSchedule] = useState('Per day');
    const [repeat, setRepeat] = useState('Daily');
    const [startDate, setStartDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = { name, category, goal, unit, repeat, startDate };
        onSave?.(formData);
        onClose();
    };

    const onSave = (formData) => { }
    const onClose = () => { }


    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl text-indigo-700 font-semibold mb-4">New Habit</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        type='text'
                        id='name'
                        placeholder='Enter the name of habit'
                        value={name}
                        handleOnChange={e => setName(e.target.value)}
                    />
                    <p className='block text-sm font-medium mb-1'>Category</p>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className='flex justify-between mb-0'>
                        <p className='block text-sm font-medium mb-1'>Goal</p>
                        <p className='block text-sm font-medium mb-1'>Goal duration</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        <input
                            type="number"
                            min={1}
                            value={goal}
                            onChange={e => setGoal(Number(e.target.value))}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                        <select
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            {units.map(u => (
                                <option key={u}>{u}</option>
                            ))}
                        </select>
                        <select
                            value={schedule}
                            onChange={e => setSchedule(e.target.value)}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            {habitSchedule.map(opt => (
                                <option key={opt}>{opt}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min={1}
                            value={goalDuration}
                            onChange={e => setGoalDuration(Number(e.target.value))}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        />
                    </div>
                    <p className='block text-sm font-medium mb-1'>Repeat</p>
                    <select
                        value={repeat}
                        onChange={e => setRepeat(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                        {repeatOptions.map(opt => (
                            <option key={opt}>{opt}</option>
                        ))}
                    </select>
                    <p className='block text-sm font-medium mb-1'>Start date</p>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-md "
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HabitFormModal;
