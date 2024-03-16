import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';

class XLSXService {
  static exportToExcel(data: any[], fileName: string = 'data'): void {
    const wb = utils.book_new();

    const ws = utils.json_to_sheet(data);
    utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = write(wb, { bookType: 'xlsx', type: 'binary' });
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);

    for (let i = 0; i < wbout.length; i++) {
      view[i] = wbout.charCodeAt(i) & 0xff;
    }

    const blob = new Blob([buf], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }
}

export default XLSXService;
