const calc_time = (create_time: string | undefined) => {
    if (!create_time)
        return "";
    const delta = new Date().getTime() - new Date(create_time).getTime();
    const date = new Date(delta);
    if (delta < 60 * 1000)
        return "Just now";
    if (delta < 60 * 60 * 1000)
        return date.getUTCMinutes() + " minutes ago";
    if (delta < 24 * 60 * 60 * 1000)
        return date.getUTCHours() + " hours ago";
    if (delta < 30 * 24 * 60 * 60 * 1000)
        return date.getUTCDate() + " days ago";
    if (delta < 12 * 30 * 24 * 60 * 60 * 1000)
        return date.getUTCMonth() + " months ago";
    else
        return date.getUTCFullYear() + " years ago";

}

export default calc_time;