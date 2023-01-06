import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import WebLinks from "../components/WebLinks";

const Page = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawControls = useRef<{
    isDrawing: boolean;
    prevX: number | null;
    prevY: number | null;
  }>({
    isDrawing: false,
    prevX: null,
    prevY: null,
  });
  const [open, setOpen] = useState(false);

  const [colors] = useState({
    black: "#000000",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    purple: "#A855F7",
    yellow: "#CA8A04",
  });
  const [selectedColor, setSelectedColor] =
    useState<keyof typeof colors>("black");

  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    document.addEventListener("touchstart", () => setMobile(true));
    document.addEventListener("onClick", () => setMobile(false));
    return () => {
      document.removeEventListener("touchstart", () => setMobile(true));
      document.removeEventListener("onClick", () => setMobile(false));
    };
  }, [mobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;
    ctx.lineWidth = 5;
  }, []);

  const startDrawing = useCallback(
    (x: number, y: number) => {
      drawControls.current.isDrawing = true;
      // draw circle
      ctxRef.current!.beginPath();
      ctxRef.current!.arc(x, y, ctxRef.current!.lineWidth / 2, 0, Math.PI * 2);
      ctxRef.current!.fillStyle = colors[selectedColor];
      ctxRef.current!.fill();
      drawControls.current.prevX = x;
      drawControls.current.prevY = y;
    },
    [colors, selectedColor]
  );

  // draw line from prevX, prevY to x, y
  const draw = useCallback(
    (x: number, y: number) => {
      if (
        drawControls.current.prevX === null ||
        drawControls.current.prevY === null
      ) {
        drawControls.current.prevX = x;
        drawControls.current.prevY = y;
        return;
      }
      ctxRef.current!.strokeStyle = colors[selectedColor];
      ctxRef.current!.beginPath();
      ctxRef.current!.moveTo(
        drawControls.current.prevX,
        drawControls.current.prevY
      );
      ctxRef.current!.lineTo(x, y);
      ctxRef.current!.stroke();
      ctxRef.current!.arc(x, y, ctxRef.current!.lineWidth / 2, 0, Math.PI * 2);
      ctxRef.current!.fill();
      drawControls.current.prevX = x;
      drawControls.current.prevY = y;
    },
    [selectedColor, colors]
  );

  const resetDrawControls = () => {
    drawControls.current.prevX = null;
    drawControls.current.prevY = null;
    drawControls.current.isDrawing = false;
  };

  const clear = () => {
    if (!ctxRef.current) return;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  return (
    <>
      <style jsx>{`
        .background {
          height: calc(100vh);
          background: linear-gradient(
              -90deg,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(-90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px),
            linear-gradient(
              transparent 3px,
              #f2f2f2 3px,
              #f2f2f2 78px,
              transparent 78px
            ),
            // linear-gradient(-90deg, #aaa 1px, transparent 1px),
            linear-gradient(
                -90deg,
                transparent 3px,
                #f2f2f2 3px,
                #f2f2f2 78px,
                transparent 78px
              ),
            linear-gradient(#f2f2f2 1px, transparent 1px), #f2f2f2;
          background-size: 4px 4px, 4px 4px, 80px 80px, 80px 80px, 80px 80px,
            80px 80px, 80px 80px, 80px 80px;
        }
      `}</style>
      <div className="relative background flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={3000}
          height={2000}
          onMouseLeave={resetDrawControls}
          onMouseDown={(e) => startDrawing(e.clientX, e.clientY)}
          onMouseUp={resetDrawControls}
          onMouseMove={(e) => {
            if (drawControls.current.isDrawing) {
              draw(e.clientX, e.clientY);
            }
          }}
          onTouchCancel={resetDrawControls}
          onTouchStart={(e) => {
            startDrawing(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={resetDrawControls}
          onTouchMove={(e) => {
            if (drawControls.current.isDrawing) {
              draw(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="absolute"
        />
        <div className="absolute top-0 w-full pointer-events-none">
          <div
            className={`${
              open ? "-translate-y-40" : "translate-y-0"
            } transition-transform ease-in-out duration-300`}
          >
            <div
              className={`pointer-events-auto w-full h-40 bg-sky-900/80 flex px-10 items-center justify-start overflow-x-scroll snap-x [&>div]:snap-center [&>div]:flex-shrink-0`}
            >
              <WebLinks />
            </div>
            <div className="mx-auto w-96 h-14 flex justify-evenly items-center">
              <div
                onClick={() => setOpen(!open)}
                className={`${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } flex justify-center items-center h-8 w-8 rounded-full pointer-events-auto shadow transition-all border-gray-500 border-2 bg-white`}
              >
                <i className="fa-solid fa-bars pointer-events-none"></i>
              </div>
              <div
                onClick={() => setSelectedColor("black")}
                className={`${
                  selectedColor === "black" && "scale-110 ring-1 ring-black"
                } ${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } h-8 w-8 rounded-full pointer-events-auto shadow transition-all border border-black bg-gray-900`}
              />
              <div
                onClick={() => setSelectedColor("red")}
                className={`${
                  selectedColor === "red" && "scale-110 ring-1 ring-black"
                } ${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } h-8 w-8 rounded-full pointer-events-auto shadow transition-all border border-red-700 bg-red-500`}
              />
              <div
                onClick={() => setSelectedColor("blue")}
                className={`${
                  selectedColor === "blue" && "scale-110 ring-1 ring-black"
                } ${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } h-8 w-8 rounded-full pointer-events-auto shadow transition-all border border-blue-700 bg-blue-500`}
              />
              <div
                onClick={() => setSelectedColor("green")}
                className={`${
                  selectedColor === "green" && "scale-110 ring-1 ring-black"
                } ${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } h-8 w-8 rounded-full pointer-events-auto shadow transition-all border border-green-700 bg-green-500`}
              />
              <div
                onClick={() => setSelectedColor("purple")}
                className={`${
                  selectedColor === "purple" && "scale-110 ring-1 ring-black"
                } ${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } h-8 w-8 rounded-full pointer-events-auto shadow transition-all border border-purple-700 bg-purple-500`}
              />
              <div
                onClick={() => setSelectedColor("yellow")}
                className={`${
                  selectedColor === "yellow" && "scale-110 ring-1 ring-black"
                } ${
                  mobile
                    ? "active:scale-110"
                    : "hover:cursor-pointer hover:scale-110"
                } h-8 w-8 rounded-full pointer-events-auto shadow transition-all border border-yellow-800 bg-yellow-600`}
              />
            </div>
          </div>
        </div>
        <div
          onClick={clear}
          className={`${
            mobile
              ? "active:scale-110 active:bg-red-400"
              : "hover:cursor-pointer hover:scale-110 hover:bg-red-400"
          } absolute bottom-6 right-6 h-8 w-8 rounded-full bg-red-500 flex justify-center items-center  transition-all`}
        >
          <i className="fas fa-times" />
        </div>
      </div>
    </>
  );
};

export default Page;
