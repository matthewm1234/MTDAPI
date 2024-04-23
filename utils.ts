export function getDate(date = null): Date {
    const time = new Date(date || new Date());
    var offset = time.getTimezoneOffset();
    offset = Math.abs(offset / 60);
    time.setHours(time.getHours() + offset);
    return time;
}