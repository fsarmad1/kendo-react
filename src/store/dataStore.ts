import { makeAutoObservable } from 'mobx';
class DataStore {
    constructor() {
        makeAutoObservable(this)
    }
    data: object[] = [];
    loadData(data: object[]) {
        
        this.data = data
    }
    addData(item: object) {
        this.data.push(item);
    }
    removeData(item: object) {
        this.data.splice(this.data.indexOf(item), 1);
    }
}
export default DataStore;