import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TypeCategory, TypeHabit, TypeHabitWithProgress } from '../../types';
import { useGetAllHabitCategoriesQuery, useCreateHabitMutation } from '../../services/habit';
import InputField from '../authPage/utils_components/InputField';


interface HabitListProps {
    habits: TypeHabitWithProgress[]
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => {
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState<TypeCategory[]>([]);
    const { data, isLoading } = useGetAllHabitCategoriesQuery();
    const [createHabit, { isLoading: isCreatingHabitLoading, error, isSuccess }] = useCreateHabitMutation();

    useEffect(() => {
        if (data) {
            setCategories(data.categories)
            console.dir({ data })
            console.dir({ categories })
        }
    }, [data])

    const handleToggleForm = async () => {
        setShowForm((prev) => !prev);
    };

    const handleAddHabit = async () => {
        if (!name.trim() || !selectedCategory) return;
        const newHabit: TypeHabit = {
            name,
            category: selectedCategory,
        };
        
        await createHabit(newHabit)
        console.log(isSuccess)
        setName('');
        setSelectedCategory('');
        setShowForm(false);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
                Your Habits
                <button
                    className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-full cursor-pointer ml-3"
                    onClick={handleToggleForm}
                >
                    {showForm ? <X /> : <Plus />}
                </button>
            </h3>

            {showForm && (
                <div className="mb-6 border-white p-4 shadow-sm max-w-lg ">
                    {isLoading ? (
                        <p className="text-gray-500">Loading categories...</p>
                    ) : (
                        <>
                            <InputField
                                id="habit_name"
                                type="text"
                                placeholder="Enter habit name"
                                value={name}
                                handleOnChange={(e) => setName(e.target.value)}
                            />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 pr-10 mt-1 mb-1"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.name} value={category.name}>
                                        {(category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase() + category.icon).replace("_", " ")}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddHabit}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
                            >
                                Add Habit
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.map((habit) => (
                    <div
                        key={habit.id}
                        className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
                    >
                        <p className="font-medium text-gray-800">{habit.name}</p>
                        <p className="text-sm text-indigo-600">{habit.category}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${habit.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{habit.progress}% complete</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HabitList;
