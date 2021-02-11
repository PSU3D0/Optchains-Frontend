export const formatTimeStr = (time) => (
    new Date(time).toString().split(" ").slice(1,5).join(" ")
    );

