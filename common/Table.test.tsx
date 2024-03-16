import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from './Table';

describe('Table', () => {
  const headers = [<th key="1">Header 1</th>, <th key="2">Header 2</th>];
  const rows = [
    <tr key="1"><td>Row 1 Col 1</td><td>Row 1 Col 2</td></tr>,
    <tr key="2"><td>Row 2 Col 1</td><td>Row 2 Col 2</td></tr>,
  ];

  it('renders the table with headers and rows', () => {
    render(<Table headers={headers} rows={rows} />);

    expect(screen.getByRole('table')).toBeInTheDocument();

    expect(screen.getByText('Header 1')).toBeInTheDocument();
    expect(screen.getByText('Header 2')).toBeInTheDocument();

    expect(screen.getByText('Row 1 Col 1')).toBeInTheDocument();
    expect(screen.getByText('Row 1 Col 2')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Col 1')).toBeInTheDocument();
    expect(screen.getByText('Row 2 Col 2')).toBeInTheDocument();
  });

  it('renders the correct number of headers and rows', () => {
    render(<Table headers={headers} rows={rows} />);

    const renderedHeaders = screen.getAllByRole('columnheader');
    expect(renderedHeaders).toHaveLength(headers.length);

    const renderedRows = screen.getAllByRole('row');
    expect(renderedRows).toHaveLength(rows.length + 1);
  });

  it('has the correct structure', () => {
    const { container } = render(<Table headers={headers} rows={rows} />);
    const thead = container.querySelector('thead');
    const tbody = container.querySelector('tbody');

    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();
    expect(thead).toContainElement(screen.getByText('Header 1'));
    expect(thead).toContainElement(screen.getByText('Header 2'));

    rows.forEach(row => {
      expect(tbody).toContainElement(screen.getByText(row.props.children[0].props.children));
      expect(tbody).toContainElement(screen.getByText(row.props.children[1].props.children));
    });
  });
});
