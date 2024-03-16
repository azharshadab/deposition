import { DialogProvider } from '@common/Dialog';
import { TranscriptsProvider } from '@hooks/useTranscripts';
import Global from '@styles/global';
import Reset from '@styles/reset';
import { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';

export const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <TranscriptsProvider>
        <DialogProvider>
          <Reset />
          <Global />
          {children}
        </DialogProvider>
      </TranscriptsProvider>
    </BrowserRouter>
  );
};
