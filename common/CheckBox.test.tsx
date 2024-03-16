import { fireEvent, render, waitFor } from '@testing-library/react';
import Checkbox from './CheckBox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <Checkbox label="Test Label" checked={false} />,
    );
    const checkbox = getByText('Test Label');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles check state when clicked', async () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox
        label="Test Label"
        checked={false}
        onChange={handleChange}
        data-testid="my-checkbox"
      />,
    );

    const checkbox = getByTestId('my-checkbox');
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  it('displays checked state correctly', () => {
    const { getByTestId } = render(
      <Checkbox label="Test Label" checked data-testid="my-checkbox" />,
    );
    const checkbox = getByTestId('my-checkbox');
    expect(checkbox).toBeChecked();
  });
});
