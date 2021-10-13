// https://codesandbox.io/s/confident-sea-u3cim?file=/src/useCustomScroll.tsx:0-3682

import React, { FC, useEffect, useLayoutEffect, useRef } from "react";

interface IUseCustomScroll {
  ref: React.RefObject<HTMLDivElement>;
}

export function useCustomScrollbar({ ref }: IUseCustomScroll) {
  useLayoutEffect(() => {
    if (!ref.current) return;
    const elm = ref.current;
    const scrollBarElm = document.createElement("div");
    scrollBarElm.style.position = "absolute";
    scrollBarElm.style.right = "0px";
    scrollBarElm.style.top = "0px";
    scrollBarElm.style.width = "8px";
    scrollBarElm.style.height = elm.clientHeight + "px";
    scrollBarElm.style.zIndex = "2";
    scrollBarElm.style.background = "rgba(99,99,99,0.2)";
    scrollBarElm.style.borderRadius = "4px";

    const scrollElm = document.createElement("div");

    scrollElm.style.position = "absolute";
    scrollElm.style.right = "0px";
    scrollElm.style.top = "0px";
    scrollElm.style.width = "8px";
    scrollElm.style.height = "50px";
    scrollElm.style.zIndex = "2";
    scrollElm.style.background = "rgba(99,99,99,0.7)";
    scrollElm.style.borderRadius = "4px";
    scrollBarElm.appendChild(scrollElm);
    const userSelect = elm.style.userSelect;
    let mdy = 0;
    let drag = false;
    const handlers = {
      start(ev: MouseEvent) {
        mdy = ev.pageY - scrollElm.offsetTop;
        drag = true;
        document.addEventListener("mousemove", handlers.move);
        document.addEventListener("mouseup", handlers.stop);
        scrollElm.removeEventListener("mousedown", handlers.start);
        //elm.removeEventListener("scroll", handlers.scroll);
        elm.style.userSelect = "none";
      },
      stop(ev: MouseEvent) {
        drag = false;
        document.removeEventListener("mousemove", handlers.move);
        document.removeEventListener("mouseup", handlers.stop);
        scrollElm.addEventListener("mousedown", handlers.start);
        //elm.addEventListener("scroll", handlers.scroll);
        elm.style.userSelect = userSelect;
      },
      move(ev: MouseEvent) {
        let mouseDeltaY = ev.pageY - mdy;
        if (mouseDeltaY < 0) mouseDeltaY = 0;
        const sh = scrollElm.clientHeight;
        const eh = elm.clientHeight - sh;
        if (mouseDeltaY > eh) mouseDeltaY = eh;
        const hh = elm.scrollHeight - elm.clientHeight;
        const r = mouseDeltaY / elm.clientHeight;
        const top = hh * r;
        scrollElm.style.top = mouseDeltaY + "px";
        elm.scrollTop = top;
        scrollBarElm.style.top = elm.scrollTop + "px";
        scrollBarElm.style.height = elm.clientHeight + "px";
      },
      scroll(ev: Event) {
        scrollBarElm.style.top = elm.scrollTop + "px";
        scrollBarElm.style.height = elm.clientHeight + "px";
        if (drag) return true;
        const hh = elm.scrollHeight - elm.clientHeight;
        if (hh === 0) {
          scrollElm.style.display = "none";
        } else {
          scrollElm.style.display = "block";
        }
        const sh = scrollElm.clientHeight;
        const st = elm.scrollTop;
        const eh = elm.clientHeight - sh;
        const r = (1 / hh) * st;
        scrollElm.style.top = r * eh + "px";
        return true;
      }
    };
    scrollElm.addEventListener("mousedown", handlers.start);

    elm.style.position = "relative";
    elm.style.boxSizing = "border-box";
    elm.appendChild(scrollBarElm);
    const hh = elm.scrollHeight - elm.clientHeight;
    if (hh === 0) {
      scrollElm.style.display = "none";
    } else {
      scrollElm.style.display = "block";
    }

    elm.addEventListener("scroll", handlers.scroll);
    return () => {
      elm.removeEventListener("scroll", handlers.scroll);
    };
  }, [ref]);

  return { ref };
}
