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
  const [waveforms, setWaveforms] = useState<number[][]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const seekContainerRef = useRef<HTMLDivElement>(null);

  // 波形データを生成
  useEffect(() => {
    const generateWaveform = () => {
      const bars = 80;
      return Array.from({ length: bars }, () => Math.random() * 0.7 + 0.3);
    };
    setWaveforms(audioFiles.map(() => generateWaveform()));
  }, [audioFiles]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
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

  // ドラッグ処理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !seekContainerRef.current || !audioRef.current) return;

      const rect = seekContainerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      const newTime = percentage * duration;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  const handleTrackClick = (index: number) => {
    if (currentTrack === index && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else if (currentTrack === index && !isPlaying) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(index);
    }
  };

  const handleSeekMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack !== index) return;
    setIsDragging(true);
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
    <div className="border border-gray-900 bg-white">
      <audio ref={audioRef}>
        {currentTrack !== null && (
          <source src={audioFiles[currentTrack].url} type="audio/mpeg" />
        )}
      </audio>

      {/* ヘッダー */}
      <div className="px-4 py-3 border-b border-gray-900">
        <span className="text-xs uppercase tracking-wider font-medium">Demo Audio</span>
      </div>

      {/* トラックリスト */}
      <div>
        {audioFiles.map((file, index) => {
          const isCurrentTrack = currentTrack === index;
          const trackProgress = isCurrentTrack ? progress : 0;
          
          return (
            <div
              key={index}
              className={`border-b border-gray-200 last:border-b-0 ${
                isCurrentTrack ? 'bg-gray-900' : 'bg-white hover:bg-gray-50'
              } transition-colors`}
            >
              {/* 波形エリア */}
              <div className="relative h-9 overflow-hidden flex">
                {/* 左半分：トラック操作エリア（再生／停止） */}
                <div
                  className="w-1/2 px-4 flex items-center justify-between cursor-pointer z-10"
                  onClick={() => handleTrackClick(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${
                      isCurrentTrack ? 'text-white' : 'text-gray-900'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-sm font-medium ${
                      isCurrentTrack ? 'text-white' : 'text-gray-900'
                    }`}>
                      {file.title}
                    </span>
                  </div>

                  {/* 再生/停止アイコン */}
                  <div className={`w-5 h-5 flex items-center justify-center ${
                    isCurrentTrack ? 'text-white' : 'text-gray-900'
                  }`}>
                    {isCurrentTrack && isPlaying ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* 右半分：波形＋シーク専用エリア */}
                <div
                  ref={isCurrentTrack ? seekContainerRef : null}
                  className={`relative w-1/2 h-full px-4 flex items-center ${
                    isCurrentTrack ? 'cursor-pointer' : ''
                  } ${isDragging ? 'cursor-grabbing' : ''}`}
                  onMouseDown={(e) => handleSeekMouseDown(index, e)}
                >
                  {/* 波形 */}
                  {isCurrentTrack && (
                    <div className="absolute inset-0 flex items-center gap-[2px] px-4">
                      {waveforms[index]?.map((height, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{
                            height: `${height * 100}%`,
                            backgroundColor:
                              (i / waveforms[index].length) * 100 < trackProgress
                                ? '#6b7280'
                                : '#4b5563',
                            minWidth: '1px',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* 再生位置バー（右半分基準） */}
                  {isCurrentTrack && (
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white z-20 pointer-events-none"
                      style={{
                        left: `calc(${trackProgress}%)`,
                      }}
                    />
                  )}

                  {/* 時間表示（右端） */}
                  <div className="absolute right-4 flex items-center gap-2 pointer-events-none z-30">
                    {isCurrentTrack && (
                      <span className="text-xs font-mono text-white">
                        {formatTime(currentTime)}
                      </span>
                    )}
                    <span className={`text-xs font-mono ${
                      isCurrentTrack ? 'text-white' : 'text-gray-600'
                    }`}>
                      {isCurrentTrack ? formatTime(duration) : '0:00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// デモ用のサンプルデータ
const sampleAudioFiles = [
  { title: 'Wavetable Demo 1', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { title: 'Synthesis Test', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { title: 'Audio Sample 3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

// デモ用のラッパー
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Audio Player with Draggable Seek</h1>
        <AudioPlayer audioFiles={sampleAudioFiles} />
      </div>
    </div>
  );
}