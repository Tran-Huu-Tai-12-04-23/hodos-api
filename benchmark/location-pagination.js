import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 200 }, // Normal load
    { duration: '5m', target: 300 }, // Peak load
    { duration: '2m', target: 500 }, // Stress testing
    { duration: '2m', target: 100 }, // Recovery
    { duration: '1m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(50)<300', 'p(90)<800', 'p(95)<1200', 'p(99)<2000'],
    http_req_failed: ['rate<0.05'], // Less than 5% failures
    http_reqs: ['rate>50'], // At least 50 requests/sec
  },
};

export default function () {
  const url = 'https://hodos-api.gitlabserver.id.vn/location/pagination';
  const payload = JSON.stringify({
    where: {
      searchKey: '',
      pageIndex: Math.floor(Math.random() * 3),
      pageSize: 10,
      type: 'LOCATION',
      name: '',
    },
    skip: 0,
    take: 10,
  });

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'k6-load-test/1.0',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI0ODBkYWJkNy1kYjNkLTQ3Y2QtYmU3My1mZDUxNWY4NzIwMTUiLCJpYXQiOjE3NTQ0MDMzMjEsImV4cCI6MTc1NDQ4OTcyMX0.OQxh2-eVB-V7RnTgSovKDJipEHHS_lEwJxeMWK6uNxM',
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is success': (r) => r.status === 200 || r.status === 201,
    'response time acceptable': (r) => r.timings.duration < 2000,
    'has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body && (Array.isArray(body) || body.data);
      } catch {
        return false;
      }
    },
  });

  sleep(Math.random() * 2 + 1);
}
