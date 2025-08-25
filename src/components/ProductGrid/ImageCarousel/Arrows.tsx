import React, { Fragment } from "react";
// import memoize from "utils/memoize";
const memoize = (Component: any) => Component;

const Arrows = ({
  scrollPrev,
  scrollNext,
  prevClassName = "",
  nextClassName = "",
  index = 1,
  slides = 0
}: {
  scrollPrev: () => void;
  scrollNext: () => void;
  prevClassName?: string;
  nextClassName?: string;
  index?: number;
  slides?: number;
}) => {
  return (
    <Fragment>
      {index !== 1 && (
        <button
          className={`embla__prev m-0 p-0 inline-flex absolute\ group-hover/item:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-transparent border-0 cursor-pointer ${prevClassName} -left-5 top-[46%] rotate-180`}
          onClick={scrollPrev}
          aria-label="previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            focusable="false"
            aria-hidden="true"
            data-analytics-id="previous"
          >
            <path d="M6 1L18 13L6 25" stroke="black" stroke-width="1.5" />
          </svg>
        </button>
      )}
      {index !== slides && (
        <button
          className={`embla__next m-0 p-0 inline-flex absolute   group-hover/item:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-transparent border-0 cursor-pointer ${nextClassName} -right-5 top-[46%]`}
          onClick={scrollNext}
          aria-label="next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            focusable="false"
            aria-hidden="true"
            data-analytics-id="next"
          >
            <path d="M6 1L18 13L6 25" stroke="black" stroke-width="1.5" />
          </svg>
        </button>
      )}
    </Fragment>
  );
};

export default memoize(Arrows);