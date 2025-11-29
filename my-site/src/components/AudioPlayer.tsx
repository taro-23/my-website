// src/components/AudioPlayer.tsx
import { useState, useRef, useEffect } from 'react';

interface AudioFile {
  title: string;
  url: string;
}

interface Props {
  audioFiles: AudioFile[];
}

export default function AudioPlayer({ audioFiles }: Props) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrack < audioFiles.length - 1) {
        setCurrentTrack(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, audioFiles.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentTrack(prev => (prev > 0 ? prev - 1 : audioFiles.length - 1));
    } else {
      setCurrentTrack(prev => (prev < audioFiles.length - 1 ? prev + 1 : 0));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (audioFiles.length === 0) return null;

  return (
    <div className="border-4 border-black bg-black p-1">
      <audio ref={audioRef}>
        <source src={audioFiles[currentTrack].url} type="audio/mpeg" />
      </audio>

      <div className="bg-green-50 border-2 border-black font-mono">
        {/* ヘッダー */}
        <div className="bg-black text-green-50 px-3 py-2 border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 animate-pulse"></div>
            <span className="text-xs font-bold tracking-wider">DEMO AUDIO</span>
          </div>
          <span className="text-xs">
            {String(currentTrack + 1).padStart(2, '0')}/{String(audioFiles.length).padStart(2, '0')}
          </span>
        </div>

        {/* 現在のトラック情報 */}
        <div className="px-3 py-2 bg-green-100 border-b-2 border-black">
          <div className="text-xs text-gray-900 mb-1 tracking-wide">NOW PLAYING:</div>
          <div className="text-sm font-bold text-black truncate">
            {audioFiles[currentTrack].title.toUpperCase()}
          </div>
        </div>

        {/* プログレスバー（ASCII風） */}
        <div className="px-3 py-2 bg-green-50 border-b-2 border-black">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-700">{formatTime(currentTime)}</span>
            <div className="flex-1 h-3 bg-white border border-black relative overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-100"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-full" style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(255,255,255,0.3) 2px,
                    rgba(255,255,255,0.3) 4px
                  )`
                }}></div>
              </div>
            </div>
            <span className="text-gray-700">{formatTime(duration)}</span>
          </div>
        </div>

        {/* コントロール */}
        <div className="px-3 py-3 bg-green-50 border-b-2 border-black flex items-center justify-center gap-2">
          <button
            onClick={() => skipTrack('prev')}
            className="w-12 h-12 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold text-xl"
            aria-label="Previous track"
          >
            ◄
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-colors flex items-center justify-center font-bold text-2xl"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '▮▮' : '►'}
          </button>

          <button
            onClick={() => skipTrack('next')}
            className="w-12 h-12 bg-white border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center font-bold text-xl"
            aria-label="Next track"
          >
            ►
          </button>
        </div>

        {/* トラックリスト */}
        <div className="max-h-40 overflow-y-auto bg-green-50">
          {audioFiles.map((file, index) => (
            <button
              key={index}
              onClick={() => setCurrentTrack(index)}
              className={`w-full text-left px-3 py-2 text-xs font-mono border-b border-gray-300 transition-colors ${
                currentTrack === index
                  ? 'bg-black text-green-50'
                  : 'hover:bg-green-100 text-black'
              }`}
            >
              <span className="inline-block w-8">
                {currentTrack === index ? '►' : ' '}
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="tracking-wide">
                {file.title.toUpperCase()}
              </span>
            </button>
          ))}
        </div>

        {/* フッター */}
        <div className="bg-black text-green-50 px-3 py-1 text-center">
          <span className="text-xs tracking-widest">READY.</span>
        </div>
      </div>
    </div>
  );
}