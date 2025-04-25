import React, { useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts'
import { HabitDailyDataResponse } from '../../../types'
import DatePicker from 'react-datepicker'
import { isAfter } from 'date-fns'
import CustomTooltip from '../../../utils_components/tool_tip'
import 'react-datepicker/dist/react-datepicker.css'

interface HabitAnalyticsChartProps {
    data: HabitDailyDataResponse[]
}

const possibleRange = {
    week: 7,
    month: 30,
    custom: 'cuctom',
} as const

type Range = keyof typeof possibleRange

const HabitAnalyticsChart: React.FC<HabitAnalyticsChartProps> = ({ data }) => {
    const [range, setRange] = useState<Range>('week')
    const [customStart, setCustomStart] = useState<Date | null>(null)
    const [customEnd, setCustomEnd] = useState<Date | null>(null)

    const getFilteredData = () => {
        const dateNow = new Date()

        let filteredData = data.filter((d) => new Date(d.date) <= dateNow)

        if (range === 'week' || range === 'month') {
            const days = possibleRange[range]
            const from = new Date(dateNow)
            from.setDate(from.getDate() - days)
            return filteredData.filter((d) => new Date(d.date) >= from)
        }
        if (range === 'custom' && customStart && customEnd) {
            return filteredData.filter((d) => {
                const date = new Date(d.date)
                return date >= customStart && date <= customEnd
            })
        }
        return filteredData
    }

    const chartData = getFilteredData()

    const getMinDate = (data: HabitDailyDataResponse[]): Date | undefined => {
        if (!data.length) return undefined
        return new Date(
            Math.min(...data.map((d) => new Date(d.date).getTime()))
        )
    }

    const getMaxDate = (data: HabitDailyDataResponse[]): Date | undefined => {
        if (!data.length) return undefined
        const today = new Date()
        const maxDataDate = new Date(
            Math.max(...data.map((d) => new Date(d.date).getTime()))
        )
        return isAfter(maxDataDate, today) ? today : maxDataDate
    }

    return (
        <div className="w-full p-4">
            <div className="flex items-center gap-1 mb-2">
                <h3 className="font-bold text-lg">📊 Habit Value Over Time</h3>
                <CustomTooltip message="This graph displays your progress based on the values ​​you have achieved." />
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <button
                    onClick={() => setRange('week')}
                    className={`px-3 py-1 rounded-md ${range === 'week' ? 'bg-indigo-600 text-white' : ''}`}
                >
                    Last 7 Days
                </button>
                <button
                    onClick={() => setRange('month')}
                    className={`px-3 py-1 rounded-md ${range === 'month' ? 'bg-indigo-600 text-white' : ''}`}
                >
                    Last 30 Days
                </button>

                {range !== 'custom' ? (
                    <button
                        onClick={() => setRange('custom')}
                        className="px-3 py-1 rounded-md"
                    >
                        Select dates
                    </button>
                ) : (
                    <DatePicker
                        selectsRange
                        startDate={customStart}
                        endDate={customEnd}
                        onChange={(dates) => {
                            const [start, end] = dates as [Date, Date]
                            setCustomStart(start)
                            setCustomEnd(end)
                        }}
                        isClearable
                        minDate={getMinDate(data)}
                        maxDate={getMaxDate(data)}
                        placeholderText="Select dates"
                        className="border-2 border-indigo-600 rounded-md px-2 w-[120px]"
                    />
                )}
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData} height={300}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default HabitAnalyticsChart
