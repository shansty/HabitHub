import React, { useState } from 'react';
import { TypeCategory, TypeHabit } from '../../types';
import { useCreateHabitMutation } from '../../services/habit';
import InputField from '../authPage/utils_components/InputField';

interface AddHabitFormProps {
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>,
    categories: TypeCategory[]
}


const AddHabitForm: React.FC<AddHabitFormProps> = ({ setShowForm, categories }) => {

    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDefined, setIsDefind] = useState(true)
    const [createHabit, { isLoading, error }] = useCreateHabitMutation();

    const handleAddHabit = async () => {
        if (!name.trim() || !selectedCategory) {
            setIsDefind(false)
        } else {
            const newHabit: TypeHabit = {
                name,
                category: selectedCategory,
            };
            await createHabit(newHabit)
            setName('');
            setSelectedCategory('');
            setShowForm(false);
        }
    };

    return (
        <>
            <InputField
                id="habit_name"
                type="text"
                placeholder="Enter habit name"
                value={name}
                handleOnChange={(e) => setName(e.target.value)}
                className='border-indigo-500'
                onFocus={() => setIsDefind(true)}
            />
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                onFocus={() => setIsDefind(true)}
                className="w-full px-4 py-2 border border-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10 mt-1 mb-1"
            >
                <option value="" className=''>Select a category</option>
                {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                        {(category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase() + category.icon).replace("_", " ")}
                    </option>
                ))}
            </select>
            {isLoading && <p>Please wait...</p>}
            {error && 'data' in error && (
                <p className="text-red-600 text-sm text-center mt-1">
                    {(error.data as any)?.message || 'Something went wrong. Please try again.'}
                </p>
            )}
            {!isDefined &&
                <p className="text-red-600 text-sm text-center mt-1 mb-1">
                    Enter habit name and select a category.
                </p>
            }
            <button
                onClick={handleAddHabit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
            >
                Add Habit
            </button>
        </>
    );
}

export default AddHabitForm;
