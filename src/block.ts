import {calculate_hash} from "./blockchain"; 

export class Block {
	
	index: number;
	previous_hash: string;
	timestamp: number;
	data: string;
	hash: string;
	
	constructor(index, previous_hash, timestamp, data, hash){
		this.index = index;
		this.previous_hash = previous_hash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash.toString();
	}

	is_valid = (previous_block) => {
		if (previous_block.index + 1 !== this.index) {
			console.log('invalid index');
			return false;
		} else if (previous_block.hash !== this.previous_hash) {
			console.log('invalid previous hash');
			return false;
		} else if (calculate_hash(this.index, this.previous_hash, this.timestamp, this.data) !== this.hash) {
			console.log('invalid hash');
			return false;
		}
		return true;
	}
}
