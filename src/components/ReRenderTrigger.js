import React, { useEffect, useState } from "react";

const ReRenderTrigger = ({ trigger }) => {
    // console.log("TRIGGER",trigger)
  const [, setUpdate] = useState(0);

  useEffect(() => {
    setUpdate((prev) => prev + 1);
  }, [trigger]);

  return null;
};

export default ReRenderTrigger;
