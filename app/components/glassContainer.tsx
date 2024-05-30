import React, { CSSProperties } from "react";

// Function to generate glassmorphism style
const getGlassStyle = (width: number, height: number): CSSProperties => ({
  background: "rgba(255, 255, 255, 0.25)", // White background with low opacity, slightly increased for brightness
  borderRadius: "15px", // Rounded corners
  padding: "20px", // Padding inside the div
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)", // Smooth shadow effect with increased blur and spread
  backdropFilter: "blur(10px)", // Blur effect
  WebkitBackdropFilter: "blur(10px)", // For Safari support
  border: "1px solid rgba(255, 255, 255, 0.18)", // Light border for overall
  borderTopLeftRadius: "15px", // Rounded corners only on the top left
  borderLeft: "2px solid rgba(255, 255, 255, 0.5)", // Lighter border on the top left
  borderTop: "2px solid rgba(255, 255, 255, 0.2)", // Lighter border on the top left
  width: `${width}px`, // Width of the div
  height: `${height}px`, // Height of the div
  display: "flex", // Flexbox layout
  flexDirection: "column", // Arrange text vertically
  justifyContent: "center", // Center content horizontally
  alignItems: "flex-start", // Align text to the start (left)
  color: "#000", // Text color
});

// GlassContainer component
interface GlassContainerProps {
  width: number;
  height: number;
  children: React.ReactNode;
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  width,
  height,
  children,
}) => {
  return <div style={getGlassStyle(width, height)}>{children}</div>;
};

export default GlassContainer;
