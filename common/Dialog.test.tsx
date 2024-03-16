import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DialogProvider, useDialogContext } from './Dialog';
import userEvent from '@testing-library/user-event';

HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

describe('Dialog', () => {
  function DialogTestComponent() {
    const { openDialog, closeDialog, sendMessage } = useDialogContext();

    return (
      <>
        <button
          data-testid="trigger-dialog"
          onClick={() =>
            openDialog(
              <div data-testid="dialog-content">
                Dialog Content
                <button
                  data-testid="trigger-second-dialog"
                  onClick={() => {
                    closeDialog();
                    openDialog(
                      <div data-testid="second-dialog-content">
                        Second Dialog Content
                      </div>,
                    );
                  }}
                >
                  Open Second Dialog
                </button>
                <button
                  data-testid="trigger-message-dialog"
                  onClick={() => sendMessage('Message sent')}
                >
                  Open Message Dialog
                </button>
              </div>,
            )
          }
        >
          Open Dialog
        </button>
      </>
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <DialogProvider>
        <DialogTestComponent />
      </DialogProvider>,
    );
  });

  it('opens the dialog with content when triggered', () => {
    fireEvent.click(screen.getByTestId('trigger-dialog'));
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it('applies message styles when dialog is a message', () => {
    fireEvent.click(screen.getByTestId('trigger-dialog'));
    fireEvent.click(screen.getByTestId('trigger-message-dialog'));
    const dialog = screen.getByTestId('styled-dialog');
    expect(dialog).toHaveStyle('width: 200px');
    expect(dialog).toHaveStyle('minHeight: 20%');
    expect(dialog).toHaveStyle('height: 5px');
    expect(dialog).toHaveStyle('color: grey');
  });

  it('renders the second dialog after closing the first one', async () => {
    userEvent.click(screen.getByTestId('trigger-dialog'));
    expect(await screen.findByTestId('dialog-content')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('trigger-second-dialog'));
    await waitFor(() =>
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument(),
    );
    expect(
      await screen.findByTestId('second-dialog-content'),
    ).toBeInTheDocument();
  });

  it('renders the first dialog after closing the message one', async () => {
    userEvent.click(screen.getByTestId('trigger-dialog'));
    expect(await screen.findByTestId('dialog-content')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('trigger-message-dialog'));

    expect(await screen.findByText('Message sent')).toBeInTheDocument(),
      userEvent.click(screen.getByTestId('close-dialog'));

    await waitFor(() =>
      expect(screen.queryByText('Message sent')).not.toBeInTheDocument(),
    );

    expect(await screen.findByTestId('dialog-content')).toBeInTheDocument();
  });
});
