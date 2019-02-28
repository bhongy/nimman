import * as http from 'http';

function setNoCacheHeader(res: http.ServerResponse): void {
  res.setHeader('Cache-Control', 'no-store, must-revalidate');
}
