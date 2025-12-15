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
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
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
      setIsPlaying(false);
      setCurrentTrack(null);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && currentTrack !== null) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const handleTrackClick = (index: number) => {
    if (currentTrack === index && isPlaying) {
      // 同じトラックをクリック = 一時停止/再生
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else if (currentTrack === index && !isPlaying) {
      // 一時停止中のトラックを再生
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      // 別のトラックを選択
      setCurrentTrack(index);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
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
    <div className="border border-gray-900 bg-white ">
      <style>{`
        .audio-progress {
          width: 100%;
          height: 1px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          outline: none;
        }

        .audio-progress::-webkit-slider-track {
          background: #e5e7eb;
          height: 1px;
        }

        .audio-progress::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 8px;
          height: 8px;
          background: #111827;
          cursor: pointer;
          border-radius: 50%;
          margin-top: -3.5px;
        }

        .audio-progress::-moz-range-track {
          background: #e5e7eb;
          height: 1px;
        }

        .audio-progress::-moz-range-thumb {
          width: 8px;
          height: 8px;
          background: #111827;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }

        .audio-progress-bg {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #111827;
          transition: width 0.1s linear;
        }
      `}</style>

      <audio ref={audioRef}>
        {currentTrack !== null && (
          <source src={audioFiles[currentTrack].url} type="audio/mpeg" />
        )}
      </audio>

      {/* ヘッダー */}
      <div className="px-4 py-3 border-b border-gray-900">
        <span className="text-xs uppercase tracking-wider font-medium">Demo Audio</span>
      </div>

      {/* プログレスバー（再生中のみ表示） */}
      {currentTrack !== null && (
        <div className="px-4 py-3 border-b border-gray-900">
          <div className="text-xs text-gray-500 mb-2">
            {audioFiles[currentTrack].title}
          </div>
          <div className="space-y-1">
            <div className="h-px bg-gray-200 relative">
              <div 
                className="audio-progress-bg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="audio-progress"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* トラックリスト */}
      <div className="divide-y divide-gray-200">
        {audioFiles.map((file, index) => (
          <button
            key={index}
            onClick={() => handleTrackClick(index)}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
              currentTrack === index
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-100 text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs w-6 shrink-0 opacity-60">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 truncate">{file.title}</span>
              {currentTrack === index && (
                <span className="text-xs shrink-0 opacity-60">
                  {isPlaying ? '►' : '❚❚'}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}