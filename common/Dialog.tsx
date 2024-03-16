import {
  DialogHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

interface DialogProps extends DialogHTMLAttributes<HTMLDialogElement> {
  isOpened: boolean;
  onClose: () => void;
  children: ReactNode;
  message?: boolean;
}

const StyledDialog = styled.dialog`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 40%;
  min-height: 70%;
  text-align: center;
  border: none;
  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  .close-button {
    z-index: 1000;
    position: absolute;
    right: 20px;
    top: 10px;
    width: 30px;
    border: none;
    outline: none;
    &:focus {
      outline: none;
      border: none;
    }
  }
`;

const DialogContext = createContext({
  openDialog: (content: ReactNode, message?: boolean) => {},
  closeDialog: () => {},
  sendMessage: (msg: string) => {},
});

export const useDialogContext = () => {
  return useContext(DialogContext);
};

interface DialogItem {
  content: ReactNode;
  isMessage: boolean;
}

export const DialogProvider = ({ children }: PropsWithChildren<{}>) => {
  const [dialogQueue, setDialogQueue] = useState<DialogItem[]>([]);
  const isDialogOpen = useMemo(() => dialogQueue.length > 0, [dialogQueue]);

  const openDialog = (content: ReactNode, isMessage: boolean = false) => {
    setDialogQueue(prevQueue => {
      if (isMessage) {
        return [{ content, isMessage }, ...prevQueue];
      }
      return [...prevQueue, { content, isMessage }];
    });
  };

  const closeDialog = () => {
    setDialogQueue(prevQueue => {
      if (prevQueue.length <= 1) {
        return [];
      }
      const [_, ...newQueue] = prevQueue;
      return newQueue;
    });
  };

  const sendMessage = (msg: string) => openDialog(<p>{msg}</p>, true);

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog, sendMessage }}>
      {children}
      {isDialogOpen && dialogQueue.length > 0 && (
        <Dialog
          message={dialogQueue[0].isMessage}
          isOpened={isDialogOpen}
          onClose={closeDialog}
        >
          {dialogQueue[0].content}
        </Dialog>
      )}
    </DialogContext.Provider>
  );
};

const Dialog = ({
  children,
  onClose,
  isOpened,
  message = false,
  ...rest
}: DialogProps) => {
  const ref = useDialog(isOpened, onClose);

  return (
    <StyledDialog
      ref={ref}
      onCancel={onClose}
      data-testid="styled-dialog"
      style={{
        width: message ? '200px' : '',
        minHeight: message ? '20%' : '',
        height: message ? '5px' : '',
        color: message ? 'grey' : '',
      }}
      {...rest}
    >
      <button
        data-testid="close-dialog"
        id="close-dialog-btn"
        className="close-button"
        onClick={onClose}
      >
        X
      </button>
      <div className="container">{children}</div>
    </StyledDialog>
  );
};

const useDialog = (isOpened: boolean, onClose: () => void) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    isOpened ? ref.current?.showModal?.() : ref.current?.close?.();
    document.body.classList.toggle('modal-open');
  }, [isOpened, onClose]);

  return ref;
};

export default Dialog;
