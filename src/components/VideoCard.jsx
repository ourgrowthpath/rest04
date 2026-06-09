export default function VideoCard({ video, onClick }) {
  const thumb = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`

  return (
    <article
      className="card overflow-hidden group cursor-pointer"
      onClick={() => onClick(video)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(video)}
      aria-label={`${video.title} 재생`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-brand-navy">
        <img
          src={thumb}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-brand-dark/30 group-hover:bg-brand-dark/20 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-brand-royal ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono">
            {video.duration}
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            video.category === 'ai'
              ? 'bg-brand-royal/90 text-white'
              : 'bg-brand-teal/90 text-white'
          }`}>
            {video.category === 'ai' ? 'AI' : 'AI 리터러시'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-brand-royal dark:group-hover:text-brand-sky transition-colors">
          {video.title}
        </h3>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {video.desc}
        </p>
        {video.date && (
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">{video.date}</p>
        )}
      </div>
    </article>
  )
}
