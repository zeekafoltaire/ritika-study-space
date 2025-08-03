import React from 'react';

// --- ICONS ---
const PlayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);
const PauseIcon: React.FC<{className?: string}> = ({className}) => (
   <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M5.75 4.5a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H5.75zm8.5 0a.75.75 0 00-.75.75v9.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5z" /></svg>
);
const PrevIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12h2V6H7zm10 12V6l-8.5 6 8.5 6z"/></svg>
);
const NextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M15 6v12h2V6h-2zm-1.5 6l-8.5-6v12l8.5-6z"/></svg>
);
const VolumeUpIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414-1.414L8.414 9H13.5a1 1 0 100-2H8.414l2.293-2.293a1 1 0 000-1.414z" clipRule="evenodd" transform="rotate(180 10 9)"/><path d="M13 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" /></svg>);

interface MusicPlayerProps {
    playlist: { title: string; artist: string; src: string }[];
    currentTrackIndex: number;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onPlayPause: () => void;
    onNextTrack: () => void;
    onPrevTrack: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
    playlist,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    onPlayPause,
    onNextTrack,
    onPrevTrack,
    onSeek,
    onVolumeChange
}) => {
    
    const currentTrack = playlist[currentTrackIndex];
    
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
    const progressSliderStyle = {
        background: `linear-gradient(to right, #FFB200 ${progressPercentage}%, #3A3B43 ${progressPercentage}%)`
    };
    
    const volumeSliderStyle = {
        background: `linear-gradient(to right, #FFB200 ${volume * 100}%, #3A3B43 ${volume * 100}%)`
    };

    return (
        <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 h-full flex flex-col justify-between shadow-card">
            <div>
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">Study Music</h3>
                <p className="text-brand-text-secondary">A curated playlist to help you focus.</p>
            </div>

            <div className="text-center">
                <h2 className="text-lg font-bold text-brand-text-primary truncate">{currentTrack.title}</h2>
                <p className="text-sm text-brand-text-secondary">{currentTrack.artist}</p>
            </div>
            
            <div className="space-y-3">
                <input
                    type="range"
                    value={currentTime}
                    step="1"
                    min="0"
                    max={duration || 0}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                    style={progressSliderStyle}
                />
                 <div className="flex justify-between text-xs font-mono text-brand-text-secondary">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-6">
                <button onClick={onPrevTrack} className="text-brand-secondary hover:text-brand-primary transition-colors">
                    <PrevIcon className="w-8 h-8" />
                </button>
                <button onClick={onPlayPause} className="text-white bg-brand-primary rounded-full p-4 shadow-lg hover:bg-brand-primary-hover transition-all">
                    {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8 pl-1" />}
                </button>
                <button onClick={onNextTrack} className="text-brand-secondary hover:text-brand-primary transition-colors">
                    <NextIcon className="w-8 h-8" />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <VolumeUpIcon className="w-5 h-5 text-brand-text-secondary" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                    style={volumeSliderStyle}
                />
             </div>
        </div>
    );
};

export default MusicPlayer;