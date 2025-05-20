import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import HabitForm from './habit_form';
import { useGetHabitCategoriesQuery } from '../../../../services/habit';
import { UnitOfMeasurement } from '../../../../enums';

vi.mock('../../../../services/habit', async () => {
    const actual = await vi.importActual<typeof import('../../../../services/habit')>(
        '../../../../services/habit'
    );

    return {
        ...actual,
        useGetHabitCategoriesQuery: vi.fn(),
        useCreateHabitMutation: () => [vi.fn(), { isLoading: false }],
        useEditHabitMutation: () => [vi.fn()],
    };
});

const mockUseGetHabitCategoriesQuery = useGetHabitCategoriesQuery as unknown as ReturnType<typeof vi.fn>;

describe('HabitForm', () => {
    const mockCategories = [
        {
            name: 'Health',
            allowedUnits: [UnitOfMeasurement.TIMES],
            icons: ['🏃'],
            defaultUnit: UnitOfMeasurement.TIMES,
            defaultIcon: '🏃',
        },
        {
            name: 'Productivity',
            allowedUnits: [UnitOfMeasurement.HOURS],
            icons: ['📚'],
            defaultUnit: UnitOfMeasurement.HOURS,
            defaultIcon: '📚',
        },
    ];

    beforeEach(() => {
        mockUseGetHabitCategoriesQuery.mockReturnValue({ data: mockCategories });
    });

    it('should shows all categories name in the dropdown when clicked', () => {
        render(
            <HabitForm
                onClose={() => { }}
                minStartDate={new Date()}
            />
        );

        const categoryDropdown = screen.getByRole('combobox', { name: /select category/i });

        fireEvent.click(categoryDropdown);
        for (const category of mockCategories) {
            expect(screen.getByText(category.name)).toBeInTheDocument();
        }
    });
});
