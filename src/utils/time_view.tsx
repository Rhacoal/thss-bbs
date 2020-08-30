import React from "react";
import moment from "moment";

export function toShortTimeString(time: string) {
    const t = moment(time);
    const today = moment();
    return t.format((t.date() === today.date() && t.month() === today.month() && t.year() === today.year())
        ? "HH:mm:ss" : "YYYY-MM-DD");
}

export function toTimeString(time: string) {
    return moment(time).format("YYYY-MM-DD HH:mm:ss");
}

export function TimeView(props: {
    time: string,
    short?: boolean,
}) {
    let str;
    if (props.short) {
        str = moment(props.time).format("YYYY-MM-DD");
    } else {
        str = moment(props.time).format("YYYY-MM-DD HH:mm:ss");
    }
    return <span className="TimeView-text">{str}</span>;
}