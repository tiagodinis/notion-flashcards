import { useRef, useEffect } from "react";

export default function OutsideAlerter({ onOutsideClick, children }) {
  const wrapperRef = useRef(null)
  useEffect(() => {
    function handleClickOutside(event) {
      if (onOutsideClick && wrapperRef.current && !wrapperRef.current.contains(event.target))
        onOutsideClick()
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [wrapperRef])

  return <div ref={wrapperRef}>{children}</div>
}