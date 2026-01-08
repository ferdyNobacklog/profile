import { useState } from 'react'

interface ProfileImageProps {
  src?: string
  alt?: string
  className?: string
  fallbackText?: string
}

const ProfileImage = ({ 
  src = '/profile.jpg', 
  alt = 'Profile', 
  className = '',
  fallbackText = '[ROOT]'
}: ProfileImageProps) => {
  const [imageError, setImageError] = useState(false)

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {!imageError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-center"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 items-center justify-center text-elegant-charcoal text-center font-mono flex">
          <div>
            <div className="text-6xl md:text-8xl mb-4">{fallbackText}</div>
            <p className="text-lg md:text-xl font-semibold text-elegant-accent">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileImage

