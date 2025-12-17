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
  const [loadingWaveforms, setLoadingWaveforms] = useState<boolean[]>([]);

  // 実際のオーディオファイルから波形データを生成
  useEffect(() => {
    const loadWaveform = async (url: string, index: number) => {
      try {
        setLoadingWaveforms(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // チャンネルデータを取得（ステレオの場合は平均化）
        const channelData = audioBuffer.getChannelData(0);
        const samples = 80; // 波形バーの数
        const blockSize = Math.floor(channelData.length / samples);
        const waveformData: number[] = [];

        for (let i = 0; i < samples; i++) {
          const start = blockSize * i;
          let sum = 0;
          
          // ブロック内の最大絶対値を取得
          for (let j = 0; j < blockSize; j++) {
            sum = Math.max(sum, Math.abs(channelData[start + j]));
          }
          
          // 0.3〜1.0の範囲に正規化
          waveformData.push(Math.max(0.3, sum));
        }

        setWaveforms(prev => {
          const newWaveforms = [...prev];
          newWaveforms[index] = waveformData;
          return newWaveforms;
        });

        setLoadingWaveforms(prev => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      } catch (error) {
        console.error('波形データの読み込みエラー:', error);
        // エラー時はランダムな波形を生成
        const fallbackWaveform = Array.from({ length: 80 }, () => Math.random() * 0.7 + 0.3);
        setWaveforms(prev => {
          const newWaveforms = [...prev];
          newWaveforms[index] = fallbackWaveform;
          return newWaveforms;
        });
        setLoadingWaveforms(prev => {
          const newState = [...prev];
          newState[index] = false;
          return newState;
        });
      }
    };

    // 全てのオーディオファイルの波形を読み込む
    audioFiles.forEach((file, index) => {
      loadWaveform(file.url, index);
    });
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

  // シーク位置を計算する共通関数
  const calculateSeekPosition = (clientX: number) => {
    if (!seekContainerRef.current || !audioRef.current) return;

    const rect = seekContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // マウスドラッグ処理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      calculateSeekPosition(e.clientX);
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

  // タッチドラッグ処理
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const touch = e.touches[0];
      calculateSeekPosition(touch.clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
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

  const handleSeekStart = (index: number, e: React.MouseEvent | React.TouchEvent) => {
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
        <span className="text-sm uppercase tracking-wider font-semibold font-mono">Demo Audio</span>
      </div>

      {/* トラックリスト */}
      <div>
        {audioFiles.map((file, index) => {
          const isCurrentTrack = currentTrack === index;
          const trackProgress = isCurrentTrack ? progress : 0;
          const isLoading = loadingWaveforms[index];

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
                  className="w-3/5 px-4 flex items-center justify-between cursor-pointer z-10"
                  onClick={() => handleTrackClick(index)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono ${
                      isCurrentTrack ? 'text-white' : 'text-gray-900'
                    }`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`text-xs font-medium font-mono ${
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
                  className={`relative w-2/5 h-full px-4 flex items-center ${
                    isCurrentTrack ? 'cursor-pointer touch-none' : ''
                  } ${isDragging ? 'cursor-grabbing' : ''}`}
                  onMouseDown={(e) => handleSeekStart(index, e)}
                  onTouchStart={(e) => handleSeekStart(index, e)}
                >
                  {/* 波形 */}
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center px-2">
                      <span className={`text-xs ${isCurrentTrack ? 'text-white' : 'text-gray-400'}`}>
                        Loading...
                      </span>
                    </div>
                  ) : waveforms[index] && (
                    <div className="absolute inset-0 flex items-center gap-0.5 px-4">
                      {waveforms[index].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1"
                          style={{
                            height: `${height * 100}%`,
                            backgroundColor:
                              (i / waveforms[index].length) * 100 < trackProgress
                                ? isCurrentTrack ? '#6b7280' : '#d1d5db'
                                : isCurrentTrack ? '#4b5563' : '#9ca3af',
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
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Audio Player with Real Waveforms</h1>
        <AudioPlayer audioFiles={sampleAudioFiles} />
      </div>
    </div>
  );
}