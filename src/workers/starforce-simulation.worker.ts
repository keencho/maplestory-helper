import {doStarForce} from '../util/starforce-util';

self.onmessage = ({ data }) => {
    
    let count = 0;
    
    console.log('event start!');
    console.time('time');
    while (count < 5000) {
        let item = structuredClone(data);

        while (item.starForce < 22) {
            item = doStarForce(item, []);
        }

        self.postMessage(item);
        count ++;
    }
    console.timeEnd('time');
    
}

export {}
