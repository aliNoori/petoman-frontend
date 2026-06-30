import 'dayjs/plugin/timezone'

declare module 'dayjs' {
    interface Dayjs {
        tz(timezone?: string, keepLocalTime?: boolean): Dayjs
    }
}
