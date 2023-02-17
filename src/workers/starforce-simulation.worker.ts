import {doSimpleStarForce} from '../util/starforce-util';
import {Equipment} from '../model/equipment.model';

self.onmessage = ({ data }: { data: { item: Equipment, simulationNumber: number, targetStarForce: number } }) => {
    
    let count = 0;
    const result = [];
    // console.log('event start!');
    // console.time('time');
    while (count < data.simulationNumber) {
        let item = structuredClone(data.item);

        while (item.starForce < data.targetStarForce) {
            item = doSimpleStarForce(item, []);
        }
        self.postMessage(Math.round(count / (data.simulationNumber / 100)));
        result.push(item);
        count ++;
    }
    // console.timeEnd('time');
    
    self.postMessage(result);
}

export {}
