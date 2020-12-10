import moment from "moment";

export const formatDate = (str, formats) => moment(str, formats).format("YYYY/MM/DD");
