export const getMonthlyGrowth = (
  records: { createdAt: Date }[],
  year?: number,
) => {
  const selectedYear = year ?? new Date().getFullYear();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const result = months.map((month) => ({
    month,
    count: 0,
  }));

  records.forEach((item) => {
    const date = new Date(item.createdAt);

    if (date.getFullYear() === selectedYear) {
      result[date.getMonth()].count++;
    }
  });

  return result;
};
