import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GroupForm } from './GroupForm'; 

describe('GroupForm', () => {
  const mockSubmitHandler = jest.fn();
  
  beforeEach(() => {
    render(
      <GroupForm
        submitHandler={mockSubmitHandler}
        loading={false}
        initialData={{ groupName: '' }}
        buttonText="Submit Group"
      />
    );
  });

  it('renders the form', () => {
    expect(screen.getByText(/group name:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit group/i })).toBeInTheDocument();
  });

  it('calls submit handler with form data on form submit', async () => {
    fireEvent.change(screen.getByRole('textbox', { name: /group name:/i }), {
      target: { value: 'New Group' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit group/i }));

    await waitFor(() => expect(mockSubmitHandler).toHaveBeenCalledWith({ groupName: 'New Group' }));
  });

  it('does not call submit handler when group name is empty', () => {
    fireEvent.click(screen.getByRole('button', { name: /submit group/i }));
    expect(mockSubmitHandler).not.toHaveBeenCalled();
  });

  it('disables submit button when group name is empty', () => {
    const button = screen.getByRole('button', { name: /submit group/i });
    expect(button).toBeDisabled();
  });

  it('enables submit button when group name is filled', () => {
    fireEvent.change(screen.getByRole('textbox', { name: /group name:/i }), {
      target: { value: 'New Group' },
    });
    const button = screen.getByRole('button', { name: /submit group/i });
    expect(button).toBeEnabled();
  });

  it('renders spinner when loading is true', () => {
    render(
      <GroupForm
        submitHandler={mockSubmitHandler}
        loading={true}
        initialData={{ groupName: '' }}
        buttonText="Submit Group"
      />
    );
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
