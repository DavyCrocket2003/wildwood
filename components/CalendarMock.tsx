"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { timeSlots } from "@/lib/mock-data";

interface CalendarMockProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
}

export default function CalendarMock({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}: CalendarMockProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });
  const today = new Date();

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="text-sm font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-muted"
            >
              {day}
            </div>
          ))}
          {days.map((day, i) => {
            const inMonth = isSameMonth(day, currentMonth);
            const selected = selectedDate && isSameDay(day, selectedDate);
            const past = isBefore(startOfDay(day), startOfDay(today));
            const isTodayDate = isToday(day);

            return (
              <button
                key={i}
                disabled={!inMonth || past}
                onClick={() => onSelectDate(day)}
                className={`rounded-lg py-2 text-center text-sm transition-all duration-150 ${
                  !inMonth
                    ? "text-transparent"
                    : past
                      ? "cursor-not-allowed text-muted/40"
                      : selected
                        ? "bg-accent font-medium text-accent-foreground"
                        : isTodayDate
                          ? "border border-accent/50 text-foreground hover:bg-surface-hover"
                          : "text-foreground hover:bg-surface-hover"
                }`}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            Available Times for {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                disabled={!slot.available}
                onClick={() => onSelectTime(slot.time)}
                className={`rounded-lg border px-3 py-2.5 text-sm transition-all duration-150 ${
                  !slot.available
                    ? "cursor-not-allowed border-border/50 text-muted/40"
                    : selectedTime === slot.time
                      ? "border-accent bg-accent font-medium text-accent-foreground"
                      : "border-border text-foreground hover:border-accent/50 hover:bg-surface-hover"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}