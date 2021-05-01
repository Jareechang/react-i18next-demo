import {
    createBrowserHistory,
    createMemoryHistory
} from 'history';

const isServer = typeof window === 'undefined';

const history = isServer
    ? createMemoryHistory()
    : createBrowserHistory();

export default history;
