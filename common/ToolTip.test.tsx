import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip from './ToolTip';

describe('Tooltip', () => {
  it('renders its children', () => {
    render(
      <Tooltip tooltipContent={<span>Tooltip info</span>}>
        <button>Hover over me</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Hover over me' })).toBeInTheDocument();
  });

  it('shows tooltip content on hover', async () => {
    render(
      <Tooltip tooltipContent={<span>Tooltip info</span>}>
        <button>Hover over me</button>
      </Tooltip>
    );
    const tooltipTrigger = screen.getByRole('button', { name: 'Hover over me' });
    fireEvent.mouseOver(tooltipTrigger);
    const tooltipContent = await screen.findByText('Tooltip info');
    expect(tooltipContent).toBeVisible();
  });

  it('hides tooltip content by default', () => {
    render(
      <Tooltip tooltipContent={<span>Tooltip info</span>}>
        <button>Hover over me</button>
      </Tooltip>
    );
    const tooltipTextElement = screen.getByTestId('tooltip-text');
    expect(tooltipTextElement).toHaveClass('tooltip');
  });    
});
