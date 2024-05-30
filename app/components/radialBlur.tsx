"use client";
import React from "react";

interface BackgroundBlurProps {
  left: string;
  top: string;
  height: string;
  width: string;
  layer: number;
  opacity: number; // Menambahkan properti opacity sebagai number
}

const RadialBlur: React.FC<BackgroundBlurProps> = ({
  left,
  top,
  height,
  width,
  opacity,
  layer,
  // Mengambil opacity dari props
}) => {
  return (
    <div
      style={{
        position: "absolute", // Menggunakan absolute agar div tetap terlihat di layar saat di-scroll
        width: width,
        height: height,
        left: left, // Ubah posisi div ke pojok kiri atas layar
        top: top, // Ubah posisi div ke pojok kiri atas layar
        background: `radial-gradient(483.9% 2719.65% at -49.5% -250%, rgba(107, 124, 255, ${opacity}), transparent)`, // Menggunakan rgba untuk opacity
        filter: "blur(150px)",
        zIndex: layer, // Mengatur z-index agar div berada di belakang semua konten
        pointerEvents: "none", // Mengatur agar div tidak merespons terhadap event mouse atau touch
        overflow: "hidden",
      }}
    ></div>
  );
};

export default RadialBlur;
