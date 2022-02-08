import React from "react";

import "./LoadingIndicator.scss";

interface LoadingBoolean {
  isLoading: boolean;
}

const LoadingIndicator: React.FC<LoadingBoolean> = ({ isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="loading-indicator-container">
        <div className="loading-indicator" />
      </div>
    );
  }
  return null;
};

export default LoadingIndicator;
