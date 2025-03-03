import { isValid } from 'date-fns';

export function isCompleteDate(date: Date | null): boolean {
    return date !== null && isValid(date);
}
