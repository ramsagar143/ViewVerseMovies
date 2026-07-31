"use client";

import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

interface PlayButtonProps {
  movieId: number;
}

export default function PlayButton({ movieId }: PlayButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Open Smartlink ad in new tab
    window.open("https://interventioncopiedloitering.com/ucx2qnm2?key=76291fbf1d15cbf95bf6d27764f47697", "_blank");

    // Route background tab to video player page
    router.push(`/play/movie/${movieId}`);
  };

  return (
    <button 
      onClick={handleClick} 
      className="btn btn-primary" 
      style={{ padding: "14px 40px", border: "none", cursor: "pointer" }}
    >
      <Play size={20} fill="currentColor" />
      Play Now
    </button>
  );
}
