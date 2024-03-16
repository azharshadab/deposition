import {
  RenderOptions,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { Wrapper } from 'wrapper';
import Pagination from './Pagination';

const renderWithWrapper = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: Wrapper, ...options });

describe('Pagination', () => {
  const handlePageChange = jest.fn();
  const setRows = jest.fn();

  it('disables the Prev button on the first page', () => {
    renderWithWrapper(
      <Pagination
        currentPage={1}
        totalPages={3}
        handlePageChange={handlePageChange}
        setRowCount={setRows}
        rowCount={0}
      />,
    );
    expect(screen.getByText('< Prev')).toBeDisabled();
  });

  it(`
    Scenario: I go to the next page of questions
    Given I select a transcript for topical analysis
    When I click the next page button
    Then the next page of transcripts are rendered based on the selected number of rows
    And the previous page button is not disabled
    `, () => {
    renderWithWrapper(
      <Pagination
        currentPage={2}
        totalPages={3}
        handlePageChange={handlePageChange}
        setRowCount={setRows}
        rowCount={0}
      />,
    );
    expect(screen.getByText('< Prev')).not.toBeDisabled();
  });

  it(`
    Scenario: I go to the last page of questions
    Given I go to the next page of questions
    When I click the next page button
    Then the last page of transcripts are rendered based on the selected number of rows
    And the next page button is disabled
    `, () => {
    renderWithWrapper(
      <Pagination
        currentPage={3}
        totalPages={3}
        handlePageChange={handlePageChange}
        setRowCount={setRows}
        rowCount={0}
      />,
    );
    expect(screen.getByText('Next >')).toBeDisabled();
  });

  it('enables the Next button when not on the last page', () => {
    renderWithWrapper(
      <Pagination
        currentPage={2}
        totalPages={3}
        handlePageChange={handlePageChange}
        setRowCount={setRows}
        rowCount={0}
      />,
    );
    expect(screen.getByText('Next >')).not.toBeDisabled();
  });

  // it('renders a page button for each page and adds the "current" class to the current page', () => {
  //   renderWithWrapper(
  //     <Pagination
  //       currentPage={3}
  //       totalPages={10}
  //       handlePageChange={handlePageChange}
  //       setRowCount={setRows}
  //       rowCount={0}
  //     />,
  //   );

  //   const pageButtons = screen.getAllByTestId('page-btn');

  //   expect(pageButtons.length).toBe(10);

  //   expect(pageButtons[2]).toHaveClass('current');
  // });

  it(`
    Scenario: I select how many questions I want rendered at one time
    Given I select a transcript for topical analysis
    When I select 25 for my rows
    Then 25 transcripts are rendered to the screen 
    And the pagination is reset to 1.
  `, async () => {
    renderWithWrapper(
      <Pagination
        currentPage={3}
        totalPages={10}
        handlePageChange={handlePageChange}
        setRowCount={setRows}
        rowCount={0}
      />,
    );

    const rowDropdown = screen.getByTestId('rows-input');
    fireEvent.change(rowDropdown, { target: { value: 25 } });
    expect(setRows).toHaveBeenCalledWith(25);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });
});
