import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import placeholder from '@/../public/placeholder.svg';

export function Logo({
  src = placeholder,
}: {
  src?: StaticImageData | string;
}) {
  return (
      <Image
        src={src}
        alt='Logo'
        sizes='50px'
        width='200'        
        style={{
          objectFit: 'cover',
        }}
        priority
        quality={85}
      />
  );
}
