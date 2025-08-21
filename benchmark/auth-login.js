import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  vus: 20,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function () {
  const url = 'https://hodos-api.gitlabserver.id.vn/auth/login';
  const payload = JSON.stringify({
    username: 'testuser',
    password: '123456',
    deviceId: `device_${Math.random().toString(36).substring(7)}`,
    fcmToken: `fcm_${Math.random().toString(36).substring(7)}`,
  });

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'k6-load-test',
  };

  const res = http.post(url, payload, { headers });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has access token': (r) => JSON.parse(r.body).accessToken !== undefined,
  });

  sleep(1);
}
