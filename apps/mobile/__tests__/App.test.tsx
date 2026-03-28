import App from '../App';

describe('Mobile App Integrity', () => {
  it('exports the root App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });
});
