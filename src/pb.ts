import PocketBase from 'pocketbase';

const url = 'https://gdeal.pockethost.io';
// const url = "http://localhost:8090"
const pb = new PocketBase(url);

export default pb;