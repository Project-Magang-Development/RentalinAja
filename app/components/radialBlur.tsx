import React from "react";

interface BackgroundBlurProps {
  left: string;
  top: string;
}

const RadialBlur: React.FC<BackgroundBlurProps> = ({ left, top }) => {
  return (
    <div
      style={{
        position: "absolute", // Menggunakan absolute agar div tetap terlihat di layar saat di-scroll
        width: "490px",
        height: "490px",
        left: left, // Ubah posisi div ke pojok kiri atas layar
        top: top, // Ubah posisi div ke pojok kiri atas layar
        background:
          "radial-gradient(483.9% 2719.65% at -49.5% -250%, #6B7CFF, transparent)",
        filter: "blur(150px)",
        zIndex: 0, // Mengatur z-index agar div berada di belakang semua konten
        pointerEvents: "none", // Mengatur agar div tidak merespons terhadap event mouse atau touch
        overflow: "hidden",
      }}
    ></div>
  );
};

export default RadialBlur;
