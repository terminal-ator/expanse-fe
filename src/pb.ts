import PocketBase from 'pocketbase';

const url = 'https://expanse.serveo.net';
// const url = "http://localhost:8090"
const pb = new PocketBase(url);

export default pb;