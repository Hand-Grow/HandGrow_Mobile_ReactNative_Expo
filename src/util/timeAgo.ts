import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const timeAgo = (dateString: string) =>
  dayjs(dateString + "Z")
    .locale("vi")
    .fromNow();
