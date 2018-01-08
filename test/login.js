import { Selector } from 'testcafe';

fixture `Getting Started`
  .page `https://dev.edu1004.kr/login`;

test('Login', async t => {
  await t
    .typeText('#agent', 'lucas@orangenamu.kr')
    .typeText('#password', 'qwer1234')
    .click('#btn-agent-login');
});
