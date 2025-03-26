import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";

const SCREEN_HEIGHT = window.innerHeight;

const CustomDrawer = forwardRef(
  (
    {
      content,
      MAX_HEIGHT = 0.62, // Drawer expanded height (62% of screen)
      MIN_HEIGHT = 0.4, // Drawer collapsed height (40% of screen)
      CLOSE_HEIGHT = 0.11,
      onStateChange,
    },
    ref
  ) => {
    const [shouldExpand, setShouldExpand] = useState(true);
    const [isClosed, setIsClosed] = useState(false);
    const [drawerHeight, setDrawerHeight] = useState(
      SCREEN_HEIGHT * MIN_HEIGHT
    );

    const startYRef = useRef(null);
    const currentHeightRef = useRef(drawerHeight); 

    useImperativeHandle(ref, () => ({
      resetToMinHeight: () => {
        setShouldExpand(true);
        setIsClosed(false);
        setDrawerHeight(SCREEN_HEIGHT * MIN_HEIGHT);
      },
      resetToCloseHeight: () => {
        setShouldExpand(false);
        setIsClosed(true);
        setDrawerHeight(SCREEN_HEIGHT * CLOSE_HEIGHT);
      },
    }));

    useEffect(() => {
      if (onStateChange) {
        onStateChange({ isClosed });
      }
    }, [isClosed]);

    const onDragging = (e) => {
      const y_coordinate = e.touches ? e.touches[0].clientY : e.clientY;

      const drawerMinHeight = SCREEN_HEIGHT * MIN_HEIGHT;
      const drawerMaxHeight = SCREEN_HEIGHT * MAX_HEIGHT;

      const difference = startYRef.current - y_coordinate;
      const newHeight = currentHeightRef.current + difference;

      let drawerPosition;
      if (newHeight < drawerMinHeight) {
        drawerPosition = SCREEN_HEIGHT * CLOSE_HEIGHT; // close the drawer
      } else {
        drawerPosition = Math.max(
          drawerMinHeight,
          Math.min(newHeight, drawerMaxHeight)
        );
      }
      setDrawerHeight(drawerPosition);

      const isDrawerClosed = drawerPosition <= SCREEN_HEIGHT * CLOSE_HEIGHT;
      const shouldExpand =
        drawerPosition > SCREEN_HEIGHT * MIN_HEIGHT &&
        !(drawerPosition >= SCREEN_HEIGHT * MAX_HEIGHT);

      setIsClosed(isDrawerClosed);
      setShouldExpand(shouldExpand);

      if (onStateChange) {
        onStateChange({
          isClosed: isDrawerClosed,
          isExpanded: !isDrawerClosed,
        });
      }
    };

    const onDragEnd = () => {
      window.removeEventListener("mousemove", onDragging);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchmove", onDragging);
      window.removeEventListener("touchend", onDragEnd);
    };

    const onDragStart = (e) => {
      startYRef.current = e.touches ? e.touches[0].clientY : e.clientY;
      currentHeightRef.current = drawerHeight;

      window.addEventListener("mousemove", onDragging);
      window.addEventListener("mouseup", onDragEnd);
      window.addEventListener("touchmove", onDragging);
      window.addEventListener("touchend", onDragEnd);
    };

    const toggleExpandCollapse = () => {
      if (shouldExpand) {
        setDrawerHeight(SCREEN_HEIGHT * MAX_HEIGHT);
        setShouldExpand(false);
        setIsClosed(false);
      } else {
        if (isClosed) {
          setDrawerHeight(SCREEN_HEIGHT * MIN_HEIGHT);
          setShouldExpand(true);
          setIsClosed(false);
        } else {
          setDrawerHeight(SCREEN_HEIGHT * CLOSE_HEIGHT);
          setIsClosed(true);
          setShouldExpand(false);
        }
      }
    };

    return (
      <div
        className="fixed bottom-0 left-0 w-full bg-s1 shadow-lg shadow-shadow rounded-t-2xl transition-all duration-300 ease-in-out z-20"
        style={{
          height: `${drawerHeight}px`,
        }}
      >
        <div
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
          onClick={toggleExpandCollapse}
          className="w-full h-10 flex items-center justify-center bg-s3 cursor-pointer rounded-t-2xl opacity-50"
        >
          <div className="w-12 h-1 mb-2 bg-s9 rounded-full" />
        </div>

        <div
          className="p-6 overflow-y-auto overflow-x-hidden"
          style={{
            height: `calc(${drawerHeight}px - 40px)`,
          }}
        >
          {content}
        </div>
      </div>
    );
  }
);

export default CustomDrawer;
