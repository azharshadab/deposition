import React from 'react';
import { render } from '@testing-library/react';
import CircleGraphCard from './CircleGraphCard'; 
import { bubbleSizingService } from '@services/bubbleSizingService';

jest.mock('@hooks/useElementDimensions', () => ({
  useElementDimensions: () => [{ width: 500, height: 500 }, jest.fn()]
}));

jest.mock('@services/bubbleSizingService');

describe('CircleGraphCard', () => {
  const mockTopics = [
    { topic: 'Topic1', radius: 100, posX: 50, posY: 50 },
    { topic: 'Topic2', radius: 80, posX: 150, posY: 150 }
  ];
  const mockSetTopics = jest.fn();

  it('renders without crashing', () => {
    const { getByTestId } = render(
        <CircleGraphCard topics={[]} setTopics={mockSetTopics} selectedTopics={[]} />
      );      
      expect(getByTestId('all-topics-button')).toBeInTheDocument();
  });

  it('displays no subtopics message when there are no topics', () => {
    const { getByText } = render(
      <CircleGraphCard topics={[]} setTopics={mockSetTopics} selectedTopics={[]} />
    );
    expect(getByText('The topic you selected has no relevant subtopics')).toBeInTheDocument();
  });

  it('renders bubbles for each topic', () => {
    const mockGetGraphedTopics = bubbleSizingService.getGraphedTopics as jest.Mock;
    mockGetGraphedTopics.mockReturnValue(mockTopics);

    const { getByTestId } = render(
      <CircleGraphCard topics={mockTopics} setTopics={mockSetTopics} selectedTopics={[]} />
    );

    mockTopics.forEach(topic => {
      expect(getByTestId(`transcript-explorer-topical-bubble-${topic.topic}`)).toBeInTheDocument();
    });
  });
});
