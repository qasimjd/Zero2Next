"use client";

import { useEffect } from "react";

const ViewCounter = ({ id }: { id: string }) => {
  useEffect(() => {
    fetch("/api/increment-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }, [id]);

  return null;
};

export default ViewCounter;
