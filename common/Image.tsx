import { ImgHTMLAttributes } from 'react';

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

const Image = ({ src, alt, ...rest }: ImageProps) => {
  return (
    <div className="img" {...rest}>
      <img
        src={`${process.env.PUBLIC_URL}/assets${src}`}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </div>
  );
};

export default Image;
