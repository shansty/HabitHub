import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TypeCategory, TypeHabitWithProgress } from '../../types';
import { useGetAllHabitCategoriesQuery } from '../../services/habit';
import AddHabitForm from './AddHabitForm';


interface HabitListProps {
    habits: TypeHabitWithProgress[]
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => {
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState<TypeCategory[]>([]);
    const { data, isLoading } = useGetAllHabitCategoriesQuery();

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
                <div className="mb-6 border-white p-4 shadow-sm max-w-2xl ">
                    {isLoading ? (
                        <p className="text-gray-500">Loading categories...</p>
                    ) : (
                        <AddHabitForm setShowForm={setShowForm} categories={categories}/>
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
