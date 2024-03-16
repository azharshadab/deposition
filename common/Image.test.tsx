import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Image from './Image'; 

describe('Image', () => {
  beforeAll(() => {
    (process.env as any).PUBLIC_URL = '/public';
  });

  it('renders the image with the correct src and alt attributes', () => {
    const testAltText = 'Test Image';
    const testSrc = '/images/test-image.jpg';
    render(<Image src={testSrc} alt={testAltText} />);

    const image = screen.getByRole('img', { name: testAltText });
    expect(image).toHaveAttribute('src', `${process.env.PUBLIC_URL}/assets${testSrc}`);
    expect(image).toHaveAttribute('alt', testAltText);
  });

  it('passes additional props to the containing div', () => {
    const title = 'A picture of a cat';
    render(<Image src="/images/cat.jpg" alt="Cat" title={title} />);

    const containerDiv = screen.getByTitle(title);
    expect(containerDiv).toBeInTheDocument();
  });

});

