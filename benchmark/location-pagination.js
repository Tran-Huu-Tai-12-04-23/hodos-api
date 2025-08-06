import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  vus: 10,
  duration: '10s',
};

export default function () {
  const url = 'https://hodos-api.gitlabserver.id.vn/location/pagination';
  const payload = JSON.stringify({
    where: {
      searchKey: '',
      pageIndex: 0,
      pageSize: 10,
      type: 'LOCATION',
      name: '',
    },
    skip: 0,
    take: 10,
  });

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI0ODBkYWJkNy1kYjNkLTQ3Y2QtYmU3My1mZDUxNWY4NzIwMTUiLCJpYXQiOjE3NTQ0MDMzMjEsImV4cCI6MTc1NDQ4OTcyMX0.OQxh2-eVB-V7RnTgSovKDJipEHHS_lEwJxeMWK6uNxM',
  };

  const res = http.post(url, payload, { headers });

  console.log(`Response time: ${res.timings.duration <= 200} ms`);
  check(res, {
    'status is 201': (r) => r.status == 201 || r.status == 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
