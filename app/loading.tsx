import React from "react";

const GlobalLoading: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <p>Загрузка...</p>
    </div>
  );
};

export default GlobalLoading;
