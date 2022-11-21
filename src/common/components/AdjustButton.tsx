import React from "react";

interface AdjustButtonProps {
  onDecrease: () => void;
  onIncrease: () => void;
}
const AdjustButton = ({ onDecrease, onIncrease }: AdjustButtonProps) => {
  return (
    <>
      <div className="btn btn-left" onClick={onDecrease}>
        <span>-</span>
      </div>
      <div className="btn btn-right" onClick={onIncrease}>
        <span>+</span>
      </div>
    </>
  );
};

export default AdjustButton;
