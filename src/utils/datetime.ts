export const getAge = (timestamp: number) => {
  const now = new Date();
  const secondsPast = (now.getTime() - timestamp) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast.toString()) + "s";
  }
  if (secondsPast < 3600) {
    return parseInt((secondsPast / 60).toString()) + "m";
  }
  if (secondsPast <= 86400) {
    return parseInt((secondsPast / 3600).toString()) + "h";
  }
  if (secondsPast > 86400) {
    return parseInt((secondsPast / 86400).toString()) + "d";
  }
};

export const getReadableDateTime = (timestamp: number | Date) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();

  const formatZero = (num: number) => {
    return num < 10 ? "0" + num : num;
  };

  const month = formatZero(date.getMonth() + 1);
  const day = formatZero(date.getDate());
  const hour = formatZero(date.getHours());
  const min = formatZero(date.getMinutes());
  const sec = formatZero(date.getSeconds());

  const time =
    year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  return time;
};
