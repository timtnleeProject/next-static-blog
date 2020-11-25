import moment from "moment";

export const formatDate = (str) => moment(str).format("YYYY/MM/DD HH:mm");
